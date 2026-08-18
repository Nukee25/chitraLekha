from rest_framework import generics

from .models import HazardAlert
from .serializers import HazardAlertSerializer


class HazardAlertListCreateView(generics.ListCreateAPIView):
    serializer_class = HazardAlertSerializer

    def get_queryset(self):
        return HazardAlert.objects.all().order_by("-timestamp_utc")
