from django.apps import AppConfig
from django.conf import settings

from mongoengine import connect


class ChitraAlertsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'chitra_alerts'

    def ready(self):
        connect(alias='default', host=settings.MONGO_URI, db=settings.MONGO_DB_NAME)
