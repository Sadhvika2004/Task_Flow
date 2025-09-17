from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Task, Project
from .serializers import TaskSerializer, ProjectSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Project):
            return obj.owner == request.user or request.method in permissions.SAFE_METHODS
        if isinstance(obj, Task):
            return obj.project and obj.project.owner == request.user or request.method in permissions.SAFE_METHODS
        return False


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        qs = Task.objects.select_related("project", "assigned_to__user")
        project_id = self.request.query_params.get("project")
        if project_id:
            qs = qs.filter(project_id=project_id)
        return qs.filter(project__owner=self.request.user)

    @action(detail=False, methods=["post"], url_path="assign")
    def assign(self, request):
        task_id = request.data.get("task_id")
        user_profile_id = request.data.get("user_profile_id")
        try:
            task = Task.objects.get(id=task_id, project__owner=request.user)
        except Task.DoesNotExist:
            return Response({"detail": "Task not found"}, status=404)
        from users.models import UserProfile
        try:
            assignee = UserProfile.objects.get(id=user_profile_id)
        except UserProfile.DoesNotExist:
            return Response({"detail": "User profile not found"}, status=404)
        task.assigned_to = assignee
        task.save()
        return Response(TaskSerializer(task).data)