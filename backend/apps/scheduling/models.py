from django.db import models
from apps.accounts.models import DoctorProfile


class WeeklyAvailability(models.Model):
    doctor = models.ForeignKey(
        DoctorProfile,
        on_delete=models.CASCADE,
        related_name="availabilities",
    )
    weekday = models.IntegerField(help_text="0=Monday, 6=Sunday")
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        unique_together = [("doctor", "weekday", "start_time")]
        ordering = ["weekday", "start_time"]

    def __str__(self):
        return f"{self.doctor} - Day {self.weekday}: {self.start_time}-{self.end_time}"


class TimeOff(models.Model):
    doctor = models.ForeignKey(
        DoctorProfile,
        on_delete=models.CASCADE,
        related_name="time_offs",
    )
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    reason = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ["start_at"]

    def __str__(self):
        return f"{self.doctor} time off: {self.start_at} to {self.end_at}"
