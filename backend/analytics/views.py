
# Create your views here.

from rest_framework import viewsets, permissions
from .models import AnalyticsRecord
from .serializers import AnalyticsRecordSerializer

class AnalyticsRecordViewSet(viewsets.ModelViewSet):
    serializer_class = AnalyticsRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Limit analytics to the current user for privacy; adjust as needed for admin reports
        return AnalyticsRecord.objects.filter(user__user=self.request.user).order_by('-timestamp')
