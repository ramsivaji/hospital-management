from rest_framework import serializers

from apps.appointments.models import Appointment


class BookingSerializer(serializers.Serializer):
    doctor_id = serializers.IntegerField()
    patient_id = serializers.IntegerField(required=False)
    start_at = serializers.DateTimeField()
    end_at = serializers.DateTimeField()


class AppointmentSerializer(serializers.ModelSerializer):
    doctor_id = serializers.IntegerField(source="doctor_id", read_only=True)
    patient_id = serializers.IntegerField(source="patient_id", read_only=True)
    doctor_name = serializers.CharField(source="doctor.user.name", read_only=True)
    patient_name = serializers.CharField(source="patient.user.name", read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id", "doctor_id", "patient_id", "doctor_name", "patient_name",
            "start_at", "end_at", "status", "notes", "created_at",
        ]
        read_only_fields = fields
