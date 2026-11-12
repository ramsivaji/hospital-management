from rest_framework import serializers
from apps.clinic.models import Specialty
from apps.accounts.models import DoctorProfile, User


class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialty
        fields = ["id", "name", "slug"]


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "name", "role", "is_active"]


class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer(read_only=True)
    specialty = SpecialtySerializer(read_only=True)

    class Meta:
        model = DoctorProfile
        fields = ["id", "user", "specialty", "bio", "slot_minutes", "buffer_minutes"]


class DoctorDetailSerializer(DoctorProfileSerializer):
    class Meta(DoctorProfileSerializer.Meta):
        fields = DoctorProfileSerializer.Meta.fields
