"""Appointment business logic."""

import datetime

from django.conf import settings
from django.db import IntegrityError, transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.accounts.models import DoctorProfile, PatientProfile, User
from apps.appointments.models import Appointment, AppointmentStatus, AppointmentStatusLog


class SlotConflictError(Exception):
    """Raised when an appointment overlaps an active appointment."""


ACTIVE_STATUSES = (AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED)


class BookingService:
    @staticmethod
    @transaction.atomic
    def book(doctor_id: int, patient_id: int, start_at: datetime.datetime,
             end_at: datetime.datetime, changed_by: User | None = None) -> Appointment:
        if start_at >= end_at:
            raise ValidationError({"end_at": "End time must be after start time."})
        if start_at <= timezone.now():
            raise ValidationError({"start_at": "Appointments must be in the future."})
        doctor = DoctorProfile.objects.select_for_update().get(pk=doctor_id)
        patient = PatientProfile.objects.get(pk=patient_id)
        if Appointment.objects.filter(
            doctor=doctor, status__in=ACTIVE_STATUSES, deleted_at__isnull=True,
            start_at__lt=end_at, end_at__gt=start_at,
        ).exists():
            raise SlotConflictError("The selected appointment slot is no longer available.")
        try:
            appointment = Appointment.objects.create(
                doctor=doctor, patient=patient, start_at=start_at, end_at=end_at,
                status=AppointmentStatus.CONFIRMED,
            )
        except IntegrityError as exc:
            raise SlotConflictError(
                "The selected appointment slot is no longer available."
            ) from exc
        AppointmentStatusLog.objects.create(
            appointment=appointment, from_status="", to_status=appointment.status,
            changed_by=changed_by,
        )
        from apps.notifications.services import EmailService
        EmailService.send_booking_confirmation(appointment)
        return appointment


class AppointmentLifecycleService:
    @staticmethod
    def _get_for_update(appointment_id: int) -> Appointment:
        return Appointment.objects.select_for_update().select_related(
            "doctor__user", "patient__user"
        ).get(pk=appointment_id)

    @staticmethod
    def _check_window(appointment: Appointment) -> None:
        window = datetime.timedelta(hours=getattr(settings, "CANCEL_WINDOW_HOURS", 2))
        if appointment.start_at - timezone.now() < window:
            raise ValidationError({
                "detail": "Cancellation and rescheduling are closed within the configured window."
            })

    @staticmethod
    @transaction.atomic
    def transition(appointment_id: int, to_status: str, changed_by: User,
                   *, new_start_at: datetime.datetime | None = None,
                   new_end_at: datetime.datetime | None = None) -> Appointment:
        appointment = AppointmentLifecycleService._get_for_update(appointment_id)
        current = appointment.status
        if new_start_at is not None:
            AppointmentLifecycleService._check_window(appointment)
            if new_end_at is None or new_start_at >= new_end_at:
                raise ValidationError({"new_end_at": "A valid end time is required."})
            if Appointment.objects.filter(
                doctor=appointment.doctor, status__in=ACTIVE_STATUSES,
                deleted_at__isnull=True, start_at__lt=new_end_at, end_at__gt=new_start_at,
            ).exclude(pk=appointment.pk).exists():
                raise SlotConflictError("The selected appointment slot is no longer available.")
            appointment.start_at, appointment.end_at = new_start_at, new_end_at
            appointment.save(update_fields=["start_at", "end_at"])
            AppointmentStatusLog.objects.create(
                appointment=appointment, from_status=current, to_status=current,
                changed_by=changed_by,
            )
            from apps.notifications.services import EmailService
            EmailService.send_reschedule(appointment)
            return appointment

        allowed = {
            AppointmentStatus.CANCELLED: {AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED},
            AppointmentStatus.COMPLETED: {AppointmentStatus.CONFIRMED},
            AppointmentStatus.NO_SHOW: {AppointmentStatus.CONFIRMED},
        }
        if to_status not in allowed or current not in allowed[to_status]:
            raise ValidationError({"status": f"Cannot transition from {current} to {to_status}."})
        if to_status == AppointmentStatus.CANCELLED:
            AppointmentLifecycleService._check_window(appointment)
            appointment.deleted_at = timezone.now()
        appointment.status = to_status
        appointment.save(update_fields=["status", "deleted_at"])
        AppointmentStatusLog.objects.create(
            appointment=appointment, from_status=current, to_status=to_status,
            changed_by=changed_by,
        )
        if to_status == AppointmentStatus.CANCELLED:
            from apps.notifications.services import EmailService
            EmailService.send_cancellation(appointment)
        return appointment
