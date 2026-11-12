from django.db.models import Q
from rest_framework.exceptions import NotFound
from apps.accounts.models import DoctorProfile
from apps.clinic.models import Specialty


def get_doctor_list(search: str | None = None, specialty_slug: str | None = None):
    qs = DoctorProfile.objects.filter(user__is_active=True).select_related("user", "specialty")

    if search:
        qs = qs.filter(
            Q(user__name__icontains=search) | Q(bio__icontains=search)
        )

    if specialty_slug:
        qs = qs.filter(specialty__slug=specialty_slug)

    return qs.order_by("user__name")


def get_doctor_detail(doctor_id: int) -> DoctorProfile:
    try:
        return DoctorProfile.objects.select_related("user", "specialty").get(
            id=doctor_id,
            user__is_active=True,
        )
    except DoctorProfile.DoesNotExist:
        raise NotFound("Doctor not found.")


def get_specialty_list():
    return Specialty.objects.all().order_by("name")
