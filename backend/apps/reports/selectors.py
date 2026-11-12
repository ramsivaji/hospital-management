import datetime
from zoneinfo import ZoneInfo
from django.conf import settings
from django.db.models import Count
from django.utils import timezone

from apps.accounts.models import DoctorProfile, PatientProfile
from apps.appointments.models import Appointment, AppointmentStatus


def get_patient_dashboard(patient_profile: PatientProfile):
    now = timezone.now()
    base_qs = (
        Appointment.objects.filter(patient=patient_profile, deleted_at__isnull=True)
        .select_related("doctor__user", "doctor__specialty", "patient__user")
    )

    upcoming = base_qs.filter(
        start_at__gte=now,
        status__in=[AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
    ).order_by("start_at")

    history = base_qs.filter(
        start_at__lt=now
    ).exclude(
        status__in=[AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED]
    ) | base_qs.filter(
        status__in=[AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED, AppointmentStatus.NO_SHOW]
    )
    history = history.order_by("-start_at")[:20]

    return {
        "upcoming": upcoming,
        "history": history,
    }


def get_doctor_dashboard(doctor_profile: DoctorProfile):
    tz_name = getattr(settings, "CLINIC_TIMEZONE", "Asia/Kolkata")
    try:
        tz = ZoneInfo(tz_name)
    except Exception:
        tz = ZoneInfo("UTC")

    now = timezone.now()
    now_local = now.astimezone(tz)
    today_start = datetime.datetime.combine(now_local.date(), datetime.time.min).replace(tzinfo=tz)
    today_end = datetime.datetime.combine(now_local.date(), datetime.time.max).replace(tzinfo=tz)
    week_end = today_start + datetime.timedelta(days=7)

    base_qs = (
        Appointment.objects.filter(doctor=doctor_profile, deleted_at__isnull=True)
        .select_related("doctor__user", "doctor__specialty", "patient__user")
    )

    today_appts = base_qs.filter(
        start_at__gte=today_start,
        start_at__lte=today_end,
    ).order_by("start_at")

    week_appts = base_qs.filter(
        start_at__gte=today_start,
        start_at__lte=week_end,
    ).order_by("start_at")

    # Counts dictionary
    counts_data = {
        "pending": base_qs.filter(status=AppointmentStatus.PENDING).count(),
        "confirmed": base_qs.filter(status=AppointmentStatus.CONFIRMED).count(),
        "completed": base_qs.filter(status=AppointmentStatus.COMPLETED).count(),
        "cancelled": base_qs.filter(status=AppointmentStatus.CANCELLED).count(),
        "no_show": base_qs.filter(status=AppointmentStatus.NO_SHOW).count(),
    }

    return {
        "today": today_appts,
        "week": week_appts,
        "counts": counts_data,
    }


def get_admin_dashboard():
    base_qs = Appointment.objects.filter(deleted_at__isnull=True)
    total = base_qs.count()

    cancelled = base_qs.filter(status=AppointmentStatus.CANCELLED).count()
    cancellation_rate = round(cancelled / total, 4) if total > 0 else 0.0

    # Busiest doctors
    doctor_counts = (
        base_qs.values("doctor_id")
        .annotate(count=Count("id"))
        .order_by("-count")[:10]
    )

    doctor_ids = [d["doctor_id"] for d in doctor_counts]
    doctors_by_id = {
        doc.id: doc
        for doc in DoctorProfile.objects.filter(id__in=doctor_ids).select_related("user", "specialty")
    }

    busiest_doctors = [
        {"doctor": doctors_by_id[d["doctor_id"]], "count": d["count"]}
        for d in doctor_counts
        if d["doctor_id"] in doctors_by_id
    ]

    # Busiest hours (0..23)
    hour_counts = {h: 0 for h in range(24)}
    tz_name = getattr(settings, "CLINIC_TIMEZONE", "Asia/Kolkata")
    try:
        tz = ZoneInfo(tz_name)
    except Exception:
        tz = ZoneInfo("UTC")

    for appt in base_qs.only("start_at"):
        local_hour = appt.start_at.astimezone(tz).hour
        hour_counts[local_hour] += 1

    busiest_hours = [{"hour": h, "count": hour_counts[h]} for h in range(24)]

    return {
        "total": total,
        "cancellation_rate": cancellation_rate,
        "busiest_doctors": busiest_doctors,
        "busiest_hours": busiest_hours,
    }
