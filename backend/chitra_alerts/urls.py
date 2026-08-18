from django.urls import path

from .views import HazardAlertListCreateView

urlpatterns = [
    path("alerts/", HazardAlertListCreateView.as_view(), name="hazard-alert-list-create"),
]
