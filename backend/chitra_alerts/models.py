from django.db import models


class HazardAlert(models.Model):
    event_type = models.CharField(max_length=255)
    timestamp_utc = models.DateTimeField()
    chunk_metadata = models.JSONField(default=dict)
    yolo_8_metadata = models.JSONField(default=dict)
    qwen_decision = models.JSONField(default=dict)
    contextual_frame_base64 = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp_utc"]

    def __str__(self):
        severity = self.qwen_decision.get("severity", "UNKNOWN") if isinstance(self.qwen_decision, dict) else "UNKNOWN"
        return f"{self.event_type} ({severity})"
