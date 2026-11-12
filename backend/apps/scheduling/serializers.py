from rest_framework import serializers
from apps.scheduling.models import WeeklyAvailability, TimeOff


class WeeklyAvailabilitySerializer(serializers.ModelSerializer):
    doctor_id = serializers.IntegerField(source="doctor.id", read_only=True)

    class Meta:
        model = WeeklyAvailability
        fields = ["id", "doctor_id", "weekday", "start_time", "end_time"]

    def validate(self, attrs):
        start = attrs.get("start_time")
        end = attrs.get("end_time")
        if start and end and start >= end:
            raise serializers.ValidationError({"end_time": "End time must be after start time."})
        return attrs


class TimeOffSerializer(serializers.ModelSerializer):
    doctor_id = serializers.IntegerField(source="doctor.id", read_only=True)

    class Meta:
        model = TimeOff
        fields = ["id", "doctor_id", "start_at", "end_at", "reason"]

    def validate(self, attrs):
        start = attrs.get("start_at")
        end = attrs.get("end_at")
        if start and end and start >= end:
            raise serializers.ValidationError({"end_at": "End at must be after start at."})
        doctor = self.context.get("doctor")
        if doctor and start and end:
            overlapping = TimeOff.objects.filter(
                doctor=doctor,
                start_at__lt=end,
                end_at__gt=start,
            )
            if self.instance:
                overlapping = overlapping.exclude(pk=self.instance.pk)
            if overlapping.exists():
                raise serializers.ValidationError(
                    {"start_at": "This time-off period overlaps an existing period."}
                )
        return attrs


class AppointmentSlotSerializer(serializers.Serializer):
    start = serializers.DateTimeField()
    end = serializers.DateTimeField()
