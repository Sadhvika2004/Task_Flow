
# Create your views here.

from rest_framework import viewsets
from .models import AnalyticsRecord
from .serializers import AnalyticsRecordSerializer

class AnalyticsRecordViewSet(viewsets.ModelViewSet):
	queryset = AnalyticsRecord.objects.all()
	serializer_class = AnalyticsRecordSerializer
