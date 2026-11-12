import datetime

import pytest
from django.utils import timezone

from apps.accounts.models import DoctorProfile, PatientProfile, User
from apps.appointments.models import Appointment
from apps.appointments.services import BookingService, SlotConflictError


@pytest.mark.django_db
def test_booking_rejects_overlapping_active_appointment():
    doctor = User.objects.create_user(
        email="doctor@example.com", name="Doctor", password="safe-password", role="doctor"
    )
    patient = User.objects.create_user(
        email="patient@example.com", name="Patient", password="safe-password", role="patient"
    )
    doctor_profile = DoctorProfile.objects.create(user=doctor)
    patient_profile = PatientProfile.objects.create(user=patient)
    start = timezone.now() + datetime.timedelta(days=1)
    end = start + datetime.timedelta(minutes=30)

    BookingService.book(doctor_profile.id, patient_profile.id, start, end)

    with pytest.raises(SlotConflictError):
        BookingService.book(doctor_profile.id, patient_profile.id, start, end)

    assert Appointment.objects.filter(doctor=doctor_profile).count() == 1
