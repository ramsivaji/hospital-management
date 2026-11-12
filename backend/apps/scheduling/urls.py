from django.urls import re_path
from apps.scheduling.views import (
    AvailabilityListCreateView,
    TimeOffListCreateView,
    SlotListView,
)

urlpatterns = [
    re_path(r"^doctors/(?P<id>\d+)/availability/?$", AvailabilityListCreateView.as_view(), name="doctor-availability"),
    re_path(r"^doctors/(?P<id>\d+)/time-off/?$", TimeOffListCreateView.as_view(), name="doctor-time-off"),
    re_path(r"^doctors/(?P<id>\d+)/slots/?$", SlotListView.as_view(), name="doctor-slots"),
]
