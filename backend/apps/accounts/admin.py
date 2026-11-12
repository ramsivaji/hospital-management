from django.contrib import admin
from apps.accounts.models import User, PatientProfile, DoctorProfile


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "name", "role", "is_active", "is_staff", "date_joined")
    list_filter = ("role", "is_active", "is_staff")
    search_fields = ("email", "name")
    ordering = ("-date_joined",)


@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "dob", "phone")
    search_fields = ("user__email", "user__name", "phone")


@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "specialty", "slot_minutes", "buffer_minutes")
    list_filter = ("specialty",)
    search_fields = ("user__email", "user__name", "bio")
