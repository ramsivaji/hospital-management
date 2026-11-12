import pytest
from rest_framework.test import APIClient

from apps.accounts.models import PatientProfile, Role, User


@pytest.mark.django_db
def test_register_creates_patient_profile():
    response = APIClient().post(
        "/api/v1/auth/register/",
        {"email": "patient@example.com", "name": "Pat", "password": "safe-password"},
        format="json",
    )

    assert response.status_code == 201
    user = User.objects.get(email="patient@example.com")
    assert user.role == Role.PATIENT
    assert PatientProfile.objects.filter(user=user).exists()
    assert response.cookies["refresh_token"]["httponly"]
