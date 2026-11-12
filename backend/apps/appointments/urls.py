from django.urls import path, re_path

from apps.appointments.views import (
    AppointmentDetailView,
    AppointmentListCreateView,
    AppointmentTransitionView,
)

urlpatterns = [
    path("appointments", AppointmentListCreateView.as_view(), name="appointments"),
    re_path(r"^appointments/(?P<pk>\d+)$", AppointmentDetailView.as_view(), name="appointment-detail"),
    re_path(
        r"^appointments/(?P<pk>\d+)/(?P<action>cancel|reschedule|complete|no-show)$",
        AppointmentTransitionView.as_view(),
        name="appointment-transition",
    ),
]
