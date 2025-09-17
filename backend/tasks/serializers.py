from rest_framework import serializers
from .models import Task, Project
from users.serializers import UserProfileSerializer


class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.id")

    class Meta:
        model = Project
        fields = ["id", "name", "color", "owner", "created_at"]


class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserProfileSerializer(read_only=True)

    class Meta:
        model = Task
        fields = "__all__"