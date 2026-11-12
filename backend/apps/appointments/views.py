import datetime

from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from rest_framework import serializers, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import PatientProfile, Role
from apps.appointments.models import Appointment, AppointmentStatus
from apps.appointments.serializers import AppointmentSerializer, BookingSerializer
from apps.appointments.services import (
    AppointmentLifecycleService,
    BookingService,
    SlotConflictError,
)


def _patient_for_user(user):
    return get_object_or_404(PatientProfile, user=user)


class AppointmentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Appointment.objects.select_related("doctor__user", "patient__user", "doctor__specialty")
        if request.user.role == Role.PATIENT:
            qs = qs.filter(patient__user=request.user)
        elif request.user.role == Role.DOCTOR:
            qs = qs.filter(doctor__user=request.user)
        elif request.user.role not in (Role.ADMIN, Role.RECEPTIONIST):
            raise PermissionDenied()
        return Response(AppointmentSerializer(qs, many=True).data)

    @method_decorator(ratelimit(key="user_or_ip", rate="30/m", method="POST", block=True))
    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        values = dict(serializer.validated_data)
        patient_id = values.pop("patient_id", None)
        if request.user.role == Role.PATIENT:
            patient_id = _patient_for_user(request.user).id
        elif request.user.role not in (Role.DOCTOR, Role.RECEPTIONIST, Role.ADMIN):
            raise PermissionDenied()
        if not patient_id:
            raise serializers.ValidationError({"patient_id": "This field is required."})
        try:
            appointment = BookingService.book(
                patient_id=patient_id, changed_by=request.user, **values
            )
        except SlotConflictError as exc:
            return Response(
                {"code": "slot_conflict", "message": str(exc), "details": {}},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(AppointmentSerializer(appointment).data, status=status.HTTP_201_CREATED)


class AppointmentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request, pk):
        appointment = get_object_or_404(
            Appointment.objects.select_related("doctor__user", "patient__user", "doctor__specialty"),
            pk=pk,
        )
        allowed = request.user.role in (Role.ADMIN, Role.RECEPTIONIST)
        allowed |= appointment.patient.user_id == request.user.id
        allowed |= appointment.doctor.user_id == request.user.id
        if not allowed:
            raise PermissionDenied()
        return appointment

    def get(self, request, pk):
        return Response(AppointmentSerializer(self.get_object(request, pk)).data)


class AppointmentTransitionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, action):
        appointment = get_object_or_404(
            Appointment.objects.select_related("doctor", "patient"), pk=pk
        )
        role = request.user.role
        if action in ("complete", "no-show") and role not in (Role.DOCTOR, Role.ADMIN):
            raise PermissionDenied()
        if action in ("cancel", "reschedule") and role not in (
            Role.PATIENT, Role.DOCTOR, Role.RECEPTIONIST, Role.ADMIN
        ):
            raise PermissionDenied()
        if role == Role.PATIENT and appointment.patient.user_id != request.user.id:
            raise PermissionDenied()
        if role == Role.DOCTOR and appointment.doctor.user_id != request.user.id:
            raise PermissionDenied()
        try:
            if action == "reschedule":
                start = datetime.datetime.fromisoformat(request.data["start_at"])
                end = datetime.datetime.fromisoformat(request.data["end_at"])
                if start.tzinfo is None:
                    start = start.replace(tzinfo=datetime.timezone.utc)
                if end.tzinfo is None:
                    end = end.replace(tzinfo=datetime.timezone.utc)
                appointment = AppointmentLifecycleService.transition(
                    pk, appointment.status, request.user,
                    new_start_at=start, new_end_at=end,
                )
            else:
                target = {
                    "cancel": AppointmentStatus.CANCELLED,
                    "complete": AppointmentStatus.COMPLETED,
                    "no-show": AppointmentStatus.NO_SHOW,
                }[action]
                appointment = AppointmentLifecycleService.transition(pk, target, request.user)
        except SlotConflictError as exc:
            return Response(
                {"code": "slot_conflict", "message": str(exc), "details": {}},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(AppointmentSerializer(appointment).data)
