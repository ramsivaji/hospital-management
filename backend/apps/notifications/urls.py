from django.urls import re_path
from apps.notifications.views import SendRemindersView

urlpatterns = [
    re_path(r"^send-reminders/?$", SendRemindersView.as_view(), name="send-reminders"),
]
