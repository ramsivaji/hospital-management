from rest_framework import serializers
from apps.appointments.serializers import AppointmentSerializer
from apps.clinic.serializers import DoctorProfileSerializer


class PatientDashboardSerializer(serializers.Serializer):
    upcoming = AppointmentSerializer(many=True)
    history = AppointmentSerializer(many=True)


class AppointmentCountsSerializer(serializers.Serializer):
    pending = serializers.IntegerField()
    confirmed = serializers.IntegerField()
    completed = serializers.IntegerField()
    cancelled = serializers.IntegerField()
    no_show = serializers.IntegerField()


class DoctorDashboardSerializer(serializers.Serializer):
    today = AppointmentSerializer(many=True)
    week = AppointmentSerializer(many=True)
    counts = AppointmentCountsSerializer()


class DoctorCountItemSerializer(serializers.Serializer):
    doctor = DoctorProfileSerializer()
    count = serializers.IntegerField()


class HourCountItemSerializer(serializers.Serializer):
    hour = serializers.IntegerField()
    count = serializers.IntegerField()


class AdminDashboardSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    cancellation_rate = serializers.FloatField()
    busiest_doctors = DoctorCountItemSerializer(many=True)
    busiest_hours = HourCountItemSerializer(many=True)
