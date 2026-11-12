from apps.accounts.models import User, PatientProfile, DoctorProfile, Role


def create_user_with_profile(email: str, name: str, password: str, role: str = Role.PATIENT, **profile_kwargs) -> User:
    user = User.objects.create_user(
        email=email,
        name=name,
        password=password,
        role=role,
    )
    if role == Role.PATIENT:
        PatientProfile.objects.create(user=user, **profile_kwargs)
    elif role == Role.DOCTOR:
        DoctorProfile.objects.create(user=user, **profile_kwargs)
    return user
