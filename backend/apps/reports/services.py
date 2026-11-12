"""Dashboard query services."""

from django.db.models import Count
from django.utils import timezone

from apps.appointments.models import Appointment, AppointmentStatus


def patient_dashboard(user):
    now = timezone.now()
    qs = Appointment.objects.filter(
        patient__user=user
    ).select_related("doctor__user", "doctor__specialty")
    return {
        "upcoming": qs.filter(start_at__gte=now).order_by("start_at")[:5],
        "past": qs.filter(start_at__lt=now).order_by("-start_at")[:10],
    }


def doctor_dashboard(user):
    now = timezone.now()
    qs = Appointment.objects.filter(
        doctor__user=user
    ).select_related("patient__user")
    return {
        "today": qs.filter(start_at__date=now.date()).order_by("start_at"),
        "week": qs.filter(
            start_at__date__gte=now.date(),
            start_at__date__lt=now.date() + timezone.timedelta(days=7),
        ).order_by("start_at"),
        "by_status": qs.values("status").annotate(count=Count("id")).order_by("status"),
    }


def admin_dashboard():
    qs = Appointment.objects.all()
    total = qs.count()
    cancelled = qs.filter(status=AppointmentStatus.CANCELLED).count()
    return {
        "total_appointments": total,
        "cancellation_rate": cancelled / total if total else 0,
        "busiest_doctors": qs.values(
            "doctor", "doctor__user__name"
        ).annotate(count=Count("id")).order_by("-count")[:5],
        "busiest_hours": qs.values(
            "start_at__hour"
        ).annotate(count=Count("id")).order_by("-count")[:5],
    }
