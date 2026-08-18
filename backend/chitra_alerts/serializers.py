from rest_framework import serializers

from .models import HazardAlert


class HazardAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = HazardAlert
        fields = [
            "id",
            "event_type",
            "timestamp_utc",
            "chunk_metadata",
            "yolo_8_metadata",
            "qwen_decision",
            "contextual_frame_base64",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
