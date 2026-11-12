from django.db import models
from apps.accounts.models import User
from apps.appointments.models import Appointment


class NotificationType(models.TextChoices):
    BOOKING_CONFIRMED = "booking_confirmed", "Booking Confirmed"
    CANCELLED = "cancelled", "Cancelled"
    RESCHEDULED = "rescheduled", "Rescheduled"
    REMINDER_24H = "reminder_24h", "Reminder 24 Hours"
    REMINDER_1H = "reminder_1h", "Reminder 1 Hour"


class NotificationStatus(models.TextChoices):
    SENT = "sent", "Sent"
    FAILED = "failed", "Failed"


class Notification(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    type = models.CharField(
        max_length=50,
        choices=NotificationType.choices,
    )
    appointment = models.ForeignKey(
        Appointment,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="notifications",
    )
    sent_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=NotificationStatus.choices,
        default=NotificationStatus.SENT,
    )

    class Meta:
        ordering = ["-sent_at"]

    def __str__(self):
        return f"Notification {self.type} to {self.user.email} [{self.status}]"
