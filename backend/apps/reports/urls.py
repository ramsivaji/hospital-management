from django.urls import re_path
from apps.reports.views import (
    PatientDashboardView,
    DoctorDashboardView,
    AdminDashboardView,
    AppointmentCSVView,
)

urlpatterns = [
    re_path(r"^dashboard/patient/?$", PatientDashboardView.as_view(), name="dashboard-patient"),
    re_path(r"^dashboard/doctor/?$", DoctorDashboardView.as_view(), name="dashboard-doctor"),
    re_path(r"^dashboard/admin/?$", AdminDashboardView.as_view(), name="dashboard-admin"),
    re_path(r"^reports/appointments\.csv/?$", AppointmentCSVView.as_view(), name="reports-appointments-csv"),
]
