
# Create your models here.

from django.db import models

class AnalyticsRecord(models.Model):
	user = models.ForeignKey('users.UserProfile', on_delete=models.CASCADE)
	action = models.CharField(max_length=255)
	timestamp = models.DateTimeField(auto_now_add=True)
	details = models.JSONField(blank=True, null=True)

	def __str__(self):
		return f"{self.user} - {self.action} @ {self.timestamp}"
