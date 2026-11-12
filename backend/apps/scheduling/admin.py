from django.contrib import admin
from apps.scheduling.models import WeeklyAvailability, TimeOff


@admin.register(WeeklyAvailability)
class WeeklyAvailabilityAdmin(admin.ModelAdmin):
    list_display = ("doctor", "weekday", "start_time", "end_time")
    list_filter = ("weekday", "doctor")


@admin.register(TimeOff)
class TimeOffAdmin(admin.ModelAdmin):
    list_display = ("doctor", "start_at", "end_at", "reason")
    list_filter = ("doctor",)
