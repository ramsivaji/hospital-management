from django.db import models


class Specialty(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Specialties"

    def __str__(self):
        return self.name
