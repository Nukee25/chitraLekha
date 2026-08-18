from mongoengine import DateTimeField, DictField, Document, StringField


class HazardAlert(Document):
    event_type = StringField(required=True)
    timestamp_utc = DateTimeField(required=True)
    chunk_metadata = DictField(required=True)
    yolo_8_metadata = DictField(required=True)
    qwen_decision = DictField(required=True)
    contextual_frame_base64 = StringField(required=True)

    meta = {
        'collection': 'hazard_alerts',
        'ordering': ['-timestamp_utc'],
    }
