from rest_framework.exceptions import NotFound, PermissionDenied
from apps.accounts.models import Role, User
from apps.appointments.models import Appointment


def get_appointments_for_user(user: User, status_filter: str | None = None):
    qs = (
        Appointment.objects.filter(deleted_at__isnull=True)
        .select_related(
            "doctor__user",
            "doctor__specialty",
            "patient__user",
        )
    )

    if user.role == Role.PATIENT:
        qs = qs.filter(patient__user=user)
    elif user.role == Role.DOCTOR:
        qs = qs.filter(doctor__user=user)
    elif user.role in [Role.ADMIN, Role.RECEPTIONIST] or user.is_staff or user.is_superuser:
        pass
    else:
        return Appointment.objects.none()

    if status_filter:
        qs = qs.filter(status=status_filter)

    return qs.order_by("start_at")


def get_appointment_detail(appointment_id: int, user: User) -> Appointment:
    try:
        appointment = (
            Appointment.objects.select_related(
                "doctor__user",
                "doctor__specialty",
                "patient__user",
            )
            .get(id=appointment_id, deleted_at__isnull=True)
        )
    except Appointment.DoesNotExist:
        raise NotFound("Appointment not found.")

    is_patient = appointment.patient.user == user
    is_doctor = appointment.doctor.user == user
    is_staff = user.role in [Role.ADMIN, Role.RECEPTIONIST] or user.is_staff or user.is_superuser

    if not (is_patient or is_doctor or is_staff):
        raise PermissionDenied("You do not have permission to view this appointment.")

    return appointment
