from rest_framework import serializers
from .models import Task, Project, Sprint
from users.serializers import UserProfileSerializer


class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.id")

    class Meta:
        model = Project
        fields = ["id", "name", "color", "owner", "created_at"]


class SprintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sprint
        fields = [
            "id",
            "name",
            "goal",
            "status",
            "start_date",
            "end_date",
            "project",
            "created_at",
        ]


class TaskSerializer(serializers.ModelSerializer):
    # Return nested profile details, but accept a simple id for writes
    assigned_to = UserProfileSerializer(read_only=True)
    assigned_to_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Task
        fields = "__all__"

    def _apply_assignee(self, instance_or_data, assigned_to_id):
        if assigned_to_id is None:
            return
        from users.models import UserProfile
        try:
            assignee = UserProfile.objects.get(id=assigned_to_id)
        except UserProfile.DoesNotExist:
            raise serializers.ValidationError({"assigned_to_id": "Invalid user profile id"})
        if isinstance(instance_or_data, Task):
            instance_or_data.assigned_to = assignee
        else:
            instance_or_data["assigned_to"] = assignee

    def create(self, validated_data):
        assigned_to_id = validated_data.pop("assigned_to_id", None)
        self._apply_assignee(validated_data, assigned_to_id)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        assigned_to_id = validated_data.pop("assigned_to_id", None)
        if assigned_to_id is not None:
            self._apply_assignee(instance, assigned_to_id)
        return super().update(instance, validated_data)