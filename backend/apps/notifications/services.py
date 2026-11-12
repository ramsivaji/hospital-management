import datetime
from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone

from apps.appointments.models import Appointment, AppointmentStatus
from apps.notifications.models import Notification, NotificationType, NotificationStatus


class EmailService:
    @staticmethod
    def _send_and_log(user, subject: str, body: str, notification_type: str, appointment=None):
        from_email = getattr(settings, "EMAIL_FROM", "noreply@yourclinic.com")
        status_val = NotificationStatus.SENT
        try:
            send_mail(
                subject=subject,
                message=body,
                from_email=from_email,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception:
            status_val = NotificationStatus.FAILED

        Notification.objects.create(
            user=user,
            type=notification_type,
            appointment=appointment,
            status=status_val,
        )

    @classmethod
    def send_booking_confirmation(cls, appointment: Appointment):
        subject = f"Appointment Confirmed with Dr. {appointment.doctor.user.name}"
        body = (
            f"Dear {appointment.patient.user.name},\n\n"
            f"Your appointment with Dr. {appointment.doctor.user.name} on "
            f"{appointment.start_at.strftime('%Y-%m-%d %H:%M %Z')} is confirmed.\n\n"
            f"Thank you!"
        )
        cls._send_and_log(
            user=appointment.patient.user,
            subject=subject,
            body=body,
            notification_type=NotificationType.BOOKING_CONFIRMED,
            appointment=appointment,
        )

    @classmethod
    def send_cancellation(cls, appointment: Appointment):
        subject = f"Appointment Cancelled - Dr. {appointment.doctor.user.name}"
        body = (
            f"Dear {appointment.patient.user.name},\n\n"
            f"Your appointment scheduled for {appointment.start_at.strftime('%Y-%m-%d %H:%M %Z')} has been cancelled.\n\n"
            f"Thank you."
        )
        cls._send_and_log(
            user=appointment.patient.user,
            subject=subject,
            body=body,
            notification_type=NotificationType.CANCELLED,
            appointment=appointment,
        )

    @classmethod
    def send_reschedule(cls, appointment: Appointment):
        subject = f"Appointment Rescheduled with Dr. {appointment.doctor.user.name}"
        body = (
            f"Dear {appointment.patient.user.name},\n\n"
            f"Your appointment with Dr. {appointment.doctor.user.name} has been rescheduled to "
            f"{appointment.start_at.strftime('%Y-%m-%d %H:%M %Z')}.\n\n"
            f"Thank you."
        )
        cls._send_and_log(
            user=appointment.patient.user,
            subject=subject,
            body=body,
            notification_type=NotificationType.RESCHEDULED,
            appointment=appointment,
        )


class ReminderService:
    @staticmethod
    def send_reminders() -> dict:
        now = timezone.now()
        sent_24h = 0
        sent_1h = 0

        # 1. 24h reminders (window: now to now + 25h)
        window_24h = now + datetime.timedelta(hours=25)
        candidates_24h = Appointment.objects.filter(
            start_at__gt=now,
            start_at__lte=window_24h,
            reminder_24h_sent_at__isnull=True,
            status__in=[AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
            deleted_at__isnull=True,
        ).select_related("patient__user", "doctor__user")

        for appt in candidates_24h:
            with transaction.atomic():
                locked = (
                    Appointment.objects.select_for_update()
                    .select_related("patient__user", "doctor__user")
                    .get(id=appt.id)
                )
                if locked.reminder_24h_sent_at is None:
                    subject = f"Reminder: Upcoming appointment tomorrow with Dr. {locked.doctor.user.name}"
                    body = (
                        f"Dear {locked.patient.user.name},\n\n"
                        f"This is a reminder for your appointment tomorrow at {locked.start_at.strftime('%Y-%m-%d %H:%M %Z')}."
                    )
                    EmailService._send_and_log(
                        user=locked.patient.user,
                        subject=subject,
                        body=body,
                        notification_type=NotificationType.REMINDER_24H,
                        appointment=locked,
                    )
                    locked.reminder_24h_sent_at = timezone.now()
                    locked.save(update_fields=["reminder_24h_sent_at"])
                    sent_24h += 1

        # 2. 1h reminders (window: now to now + 65 minutes)
        window_1h = now + datetime.timedelta(minutes=65)
        candidates_1h = Appointment.objects.filter(
            start_at__gt=now,
            start_at__lte=window_1h,
            reminder_1h_sent_at__isnull=True,
            status__in=[AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
            deleted_at__isnull=True,
        ).select_related("patient__user", "doctor__user")

        for appt in candidates_1h:
            with transaction.atomic():
                locked = (
                    Appointment.objects.select_for_update()
                    .select_related("patient__user", "doctor__user")
                    .get(id=appt.id)
                )
                if locked.reminder_1h_sent_at is None:
                    subject = f"Reminder: Upcoming appointment in 1 hour with Dr. {locked.doctor.user.name}"
                    body = (
                        f"Dear {locked.patient.user.name},\n\n"
                        f"This is a reminder that your appointment starts at {locked.start_at.strftime('%Y-%m-%d %H:%M %Z')}."
                    )
                    EmailService._send_and_log(
                        user=locked.patient.user,
                        subject=subject,
                        body=body,
                        notification_type=NotificationType.REMINDER_1H,
                        appointment=locked,
                    )
                    locked.reminder_1h_sent_at = timezone.now()
                    locked.save(update_fields=["reminder_1h_sent_at"])
                    sent_1h += 1

        return {"sent_24h": sent_24h, "sent_1h": sent_1h}
