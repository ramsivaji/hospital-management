from apps.accounts.models import User, PatientProfile, DoctorProfile


def get_user_by_id(user_id: int) -> User | None:
    return User.objects.filter(id=user_id, is_active=True).first()


def get_patient_profile(user: User) -> PatientProfile | None:
    return getattr(user, "patient_profile", None)


def get_doctor_profile(user: User) -> DoctorProfile | None:
    return getattr(user, "doctor_profile", None)
