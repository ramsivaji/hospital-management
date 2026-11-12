import csv
from django.http import HttpResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound

from apps.accounts.models import Role, PatientProfile, DoctorProfile
from apps.accounts.permissions import IsAdmin
from apps.appointments.models import Appointment
from apps.reports.selectors import (
    get_patient_dashboard,
    get_doctor_dashboard,
    get_admin_dashboard,
)
from apps.reports.serializers import (
    PatientDashboardSerializer,
    DoctorDashboardSerializer,
    AdminDashboardSerializer,
)


class PatientDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if user.role == Role.PATIENT:
            patient_profile, _ = PatientProfile.objects.get_or_create(user=user)
        elif user.role in [Role.ADMIN, Role.RECEPTIONIST] or user.is_staff:
            patient_id = request.query_params.get("patient_id")
            if patient_id:
                try:
                    patient_profile = PatientProfile.objects.get(id=patient_id)
                except PatientProfile.DoesNotExist:
                    raise NotFound("Patient profile not found.")
            else:
                patient_profile = PatientProfile.objects.first()
                if not patient_profile:
                    return Response({"upcoming": [], "history": []})
        else:
            raise PermissionDenied("Only patients can access the patient dashboard.")

        data = get_patient_dashboard(patient_profile)
        serializer = PatientDashboardSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DoctorDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if user.role == Role.DOCTOR:
            doctor_profile = getattr(user, "doctor_profile", None)
            if not doctor_profile:
                raise NotFound("Doctor profile not found.")
        elif user.role in [Role.ADMIN, Role.RECEPTIONIST] or user.is_staff:
            doctor_id = request.query_params.get("doctor_id")
            if doctor_id:
                try:
                    doctor_profile = DoctorProfile.objects.get(id=doctor_id)
                except DoctorProfile.DoesNotExist:
                    raise NotFound("Doctor profile not found.")
            else:
                doctor_profile = DoctorProfile.objects.first()
                if not doctor_profile:
                    return Response(
                        {
                            "today": [],
                            "week": [],
                            "counts": {"pending": 0, "confirmed": 0, "completed": 0, "cancelled": 0, "no_show": 0},
                        }
                    )
        else:
            raise PermissionDenied("Only doctors can access the doctor dashboard.")

        data = get_doctor_dashboard(doctor_profile)
        serializer = DoctorDashboardSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminDashboardView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, *args, **kwargs):
        data = get_admin_dashboard()
        serializer = AdminDashboardSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AppointmentCSVView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, *args, **kwargs):
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="appointments.csv"'

        writer = csv.writer(response)
        writer.writerow(["ID", "Doctor", "Specialty", "Patient", "Patient Email", "Start At", "End At", "Status", "Created At"])

        appointments = (
            Appointment.objects.filter(deleted_at__isnull=True)
            .select_related("doctor__user", "doctor__specialty", "patient__user")
            .order_by("-start_at")
        )

        for appt in appointments:
            writer.writerow(
                [
                    appt.id,
                    appt.doctor.user.name,
                    appt.doctor.specialty.name if appt.doctor.specialty else "",
                    appt.patient.user.name,
                    appt.patient.user.email,
                    appt.start_at.isoformat(),
                    appt.end_at.isoformat(),
                    appt.status,
                    appt.created_at.isoformat(),
                ]
            )

        return response
