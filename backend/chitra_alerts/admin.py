from django.contrib import admin

from .models import HazardAlert


@admin.register(HazardAlert)
class HazardAlertAdmin(admin.ModelAdmin):
    list_display = ("id", "event_type", "timestamp_utc", "created_at")
    search_fields = ("event_type",)
    ordering = ("-timestamp_utc",)
