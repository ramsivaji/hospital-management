from apps.scheduling.models import WeeklyAvailability, TimeOff


def get_availability(doctor_id: int):
    return WeeklyAvailability.objects.filter(doctor_id=doctor_id).order_by("weekday", "start_time")


def get_time_off(doctor_id: int):
    return TimeOff.objects.filter(doctor_id=doctor_id).order_by("start_at")
