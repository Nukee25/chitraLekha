from rest_framework_mongoengine.generics import ListCreateAPIView

from .models import HazardAlert
from .serializers import HazardAlertSerializer


class HazardAlertListCreateView(ListCreateAPIView):
    serializer_class = HazardAlertSerializer

    def get_queryset(self):
        return HazardAlert.objects.order_by('-timestamp_utc')
