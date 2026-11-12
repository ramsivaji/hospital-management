from django.contrib import admin
from apps.appointments.models import Appointment, AppointmentStatusLog


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ("id", "doctor", "patient", "start_at", "end_at", "status", "created_at")
    list_filter = ("status", "doctor")
    search_fields = ("doctor__user__name", "patient__user__name")


@admin.register(AppointmentStatusLog)
class AppointmentStatusLogAdmin(admin.ModelAdmin):
    list_display = ("appointment", "from_status", "to_status", "changed_by", "at")
    list_filter = ("to_status",)
