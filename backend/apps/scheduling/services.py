import datetime
from zoneinfo import ZoneInfo
from django.conf import settings
from django.utils import timezone
from rest_framework.exceptions import NotFound

from apps.accounts.models import DoctorProfile
from apps.scheduling.models import WeeklyAvailability, TimeOff
from apps.appointments.models import Appointment, AppointmentStatus


class SlotService:
    @staticmethod
    def get_slots(doctor_id: int, target_date: datetime.date) -> list[dict]:
        try:
            doctor = DoctorProfile.objects.get(id=doctor_id, user__is_active=True)
        except DoctorProfile.DoesNotExist:
            raise NotFound("Doctor not found.")

        slot_minutes = doctor.slot_minutes or 30
        buffer_minutes = doctor.buffer_minutes or 5
        slot_delta = datetime.timedelta(minutes=slot_minutes)
        buffer_delta = datetime.timedelta(minutes=buffer_minutes)

        # Get timezone
        tz_name = getattr(settings, "CLINIC_TIMEZONE", "Asia/Kolkata")
        try:
            tz = ZoneInfo(tz_name)
        except Exception:
            tz = ZoneInfo("UTC")

        weekday = target_date.weekday()
        availabilities = WeeklyAvailability.objects.filter(
            doctor=doctor,
            weekday=weekday,
        ).order_by("start_time")

        if not availabilities.exists():
            return []

        # Find date bounds in UTC/timezone
        day_start = datetime.datetime.combine(target_date, datetime.time.min).replace(tzinfo=tz)
        day_end = datetime.datetime.combine(target_date, datetime.time.max).replace(tzinfo=tz)

        # Load TimeOff overlapping the day
        time_offs = list(
            TimeOff.objects.filter(
                doctor=doctor,
                start_at__lt=day_end,
                end_at__gt=day_start,
            )
        )

        # Load Appointments overlapping the day
        appointments = list(
            Appointment.objects.filter(
                doctor=doctor,
                start_at__lt=day_end,
                end_at__gt=day_start,
                status__in=[AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
                deleted_at__isnull=True,
            )
        )

        now = timezone.now()
        cancel_window_hours = getattr(settings, "CANCEL_WINDOW_HOURS", 2)
        min_start_time = now + datetime.timedelta(hours=cancel_window_hours)

        candidate_slots = []
        for avail in availabilities:
            window_start = datetime.datetime.combine(target_date, avail.start_time).replace(tzinfo=tz)
            window_end = datetime.datetime.combine(target_date, avail.end_time).replace(tzinfo=tz)

            curr = window_start
            while curr + slot_delta <= window_end:
                s_start = curr
                s_end = curr + slot_delta

                # Advance cursor including buffer
                curr = s_end + buffer_delta

                # 1. Check if slot is within booking window / in future
                if s_start <= min_start_time:
                    continue

                # 2. Check overlap with TimeOff
                has_time_off = any(
                    s_start < to.end_at and s_end > to.start_at
                    for to in time_offs
                )
                if has_time_off:
                    continue

                # 3. Check overlap with active Appointments
                has_conflict = any(
                    s_start < appt.end_at and s_end > appt.start_at
                    for appt in appointments
                )
                if has_conflict:
                    continue

                candidate_slots.append({"start": s_start, "end": s_end})

        return candidate_slots
