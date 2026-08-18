from rest_framework_mongoengine.serializers import DocumentSerializer

from .models import HazardAlert


class HazardAlertSerializer(DocumentSerializer):
    class Meta:
        model = HazardAlert
        fields = [
            'id',
            'event_type',
            'timestamp_utc',
            'chunk_metadata',
            'yolo_8_metadata',
            'qwen_decision',
            'contextual_frame_base64',
        ]
