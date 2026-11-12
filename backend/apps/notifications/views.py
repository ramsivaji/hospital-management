from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.notifications.services import ReminderService


class SendRemindersView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        expected_secret = getattr(settings, "CRON_SECRET", "")
        if expected_secret:
            auth_header = request.headers.get("Authorization", "")
            expected_header = f"Bearer {expected_secret}"
            if auth_header != expected_header:
                return Response(
                    {
                        "code": "authentication_failed",
                        "message": "Invalid or missing cron secret.",
                        "details": {},
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )

        result = ReminderService.send_reminders()
        return Response(result, status=status.HTTP_200_OK)
