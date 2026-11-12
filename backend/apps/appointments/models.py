from django.db import models
from apps.accounts.models import User, PatientProfile, DoctorProfile

try:
    from django.contrib.postgres.constraints import ExclusionConstraint
    from django.contrib.postgres.fields import DateTimeRangeField, RangeOperators
except ImportError:
    ExclusionConstraint = None


class AppointmentStatus(models.TextChoices):
    PENDING = "pending", "Pending"
    CONFIRMED = "confirmed", "Confirmed"
    CANCELLED = "cancelled", "Cancelled"
    COMPLETED = "completed", "Completed"
    NO_SHOW = "no_show", "No Show"


class Appointment(models.Model):
    doctor = models.ForeignKey(
        DoctorProfile,
        on_delete=models.CASCADE,
        related_name="appointments",
    )
    patient = models.ForeignKey(
        PatientProfile,
        on_delete=models.CASCADE,
        related_name="appointments",
    )
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    status = models.CharField(
        max_length=20,
        choices=AppointmentStatus.choices,
        default=AppointmentStatus.PENDING,
    )
    reminder_24h_sent_at = models.DateTimeField(null=True, blank=True)
    reminder_1h_sent_at = models.DateTimeField(null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["start_at"]
        indexes = [
            models.Index(fields=["doctor", "start_at"]),
            models.Index(fields=["patient", "start_at"]),
            models.Index(fields=["status", "start_at"]),
        ]
        constraints = []
        if ExclusionConstraint is not None:
            constraints.append(
                ExclusionConstraint(
                    name="no_overlapping_active_appointments",
                    expressions=[
                        ("doctor", RangeOperators.EQUAL),
                        (
                            models.Func(
                                models.F("start_at"),
                                models.F("end_at"),
                                function="TSTZRANGE",
                                output_field=DateTimeRangeField(),
                            ),
                            RangeOperators.OVERLAPS,
                        ),
                    ],
                    condition=models.Q(
                        status__in=[AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
                        deleted_at__isnull=True,
                    ),
                )
            )

    def __str__(self):
        return f"Appt {self.id}: {self.patient} with {self.doctor} at {self.start_at} ({self.status})"


class AppointmentStatusLog(models.Model):
    appointment = models.ForeignKey(
        Appointment,
        on_delete=models.CASCADE,
        related_name="status_logs",
    )
    from_status = models.CharField(max_length=20, blank=True)
    to_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="appointment_status_changes",
    )
    at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-at"]

    def __str__(self):
        return f"Appt {self.appointment_id}: {self.from_status} -> {self.to_status} at {self.at}"
