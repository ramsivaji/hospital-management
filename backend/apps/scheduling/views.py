import datetime
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError, NotFound

from apps.accounts.models import DoctorProfile, Role
from apps.scheduling.models import WeeklyAvailability, TimeOff
from apps.scheduling.serializers import (
    WeeklyAvailabilitySerializer,
    TimeOffSerializer,
    AppointmentSlotSerializer,
)
from apps.scheduling.services import SlotService
from apps.scheduling.selectors import get_availability, get_time_off


def check_doctor_access(user, doctor_id: int):
    if user.role == Role.ADMIN or user.is_staff or user.is_superuser:
        return
    if user.role == Role.DOCTOR:
        doctor_profile = getattr(user, "doctor_profile", None)
        if doctor_profile and doctor_profile.id == doctor_id:
            return
    raise PermissionDenied("You do not have permission to manage this doctor's schedule.")


class AvailabilityListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = WeeklyAvailabilitySerializer

    def get_queryset(self):
        doctor_id = self.kwargs["id"]
        return get_availability(doctor_id)

    def perform_create(self, serializer):
        doctor_id = self.kwargs["id"]
        check_doctor_access(self.request.user, doctor_id)
        try:
            doctor = DoctorProfile.objects.get(id=doctor_id)
        except DoctorProfile.DoesNotExist:
            raise NotFound("Doctor not found.")
        serializer.save(doctor=doctor)


class TimeOffListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TimeOffSerializer

    def get_queryset(self):
        doctor_id = self.kwargs["id"]
        return get_time_off(doctor_id)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["doctor"] = DoctorProfile.objects.filter(
            id=self.kwargs["id"]
        ).first()
        return context

    def perform_create(self, serializer):
        doctor_id = self.kwargs["id"]
        check_doctor_access(self.request.user, doctor_id)
        try:
            doctor = DoctorProfile.objects.get(id=doctor_id)
        except DoctorProfile.DoesNotExist:
            raise NotFound("Doctor not found.")
        serializer.save(doctor=doctor)


class SlotListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id, *args, **kwargs):
        date_str = request.query_params.get("date")
        if not date_str:
            raise ValidationError({"date": "Query parameter 'date' (YYYY-MM-DD) is required."})

        try:
            target_date = datetime.date.fromisoformat(date_str)
        except ValueError:
            raise ValidationError({"date": "Invalid date format. Expected YYYY-MM-DD."})

        slots = SlotService.get_slots(doctor_id=id, target_date=target_date)
        serializer = AppointmentSlotSerializer(slots, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
