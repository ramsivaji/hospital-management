from rest_framework.permissions import BasePermission
from apps.accounts.models import Role


class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == Role.PATIENT
        )


class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == Role.DOCTOR
        )


class IsReceptionist(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == Role.RECEPTIONIST
        )


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role == Role.ADMIN or request.user.is_staff or request.user.is_superuser)
        )


class IsOwnerOrAdmin(BasePermission):
    """
    Object-level permission allowing:
    - The patient owning the object
    - The doctor owning the object
    - Receptionist or Admin
    """
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.user.role in [Role.ADMIN, Role.RECEPTIONIST] or request.user.is_staff:
            return True

        # Check if obj is an Appointment
        if hasattr(obj, "patient") and hasattr(obj.patient, "user"):
            if obj.patient.user == request.user:
                return True
        if hasattr(obj, "doctor") and hasattr(obj.doctor, "user"):
            if obj.doctor.user == request.user:
                return True

        # Check if obj is a Profile
        if hasattr(obj, "user") and obj.user == request.user:
            return True

        return False
