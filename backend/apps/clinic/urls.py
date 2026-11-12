from django.urls import path, re_path
from apps.clinic.views import (
    DoctorListView,
    DoctorDetailView,
    SpecialtyListCreateView,
    SpecialtyDetailView,
)

urlpatterns = [
    re_path(r"^doctors/?$", DoctorListView.as_view(), name="doctor-list"),
    re_path(r"^doctors/(?P<pk>\d+)/?$", DoctorDetailView.as_view(), name="doctor-detail"),
    re_path(r"^admin/specialties/?$", SpecialtyListCreateView.as_view(), name="admin-specialty-list"),
    re_path(r"^admin/specialties/(?P<pk>\d+)/?$", SpecialtyDetailView.as_view(), name="admin-specialty-detail"),
]
