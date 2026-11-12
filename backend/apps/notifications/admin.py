from django.contrib import admin
from apps.notifications.models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "type", "appointment", "sent_at", "status")
    list_filter = ("type", "status")
    search_fields = ("user__email", "user__name")
