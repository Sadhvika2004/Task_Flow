from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Task, Project, Sprint
from .serializers import TaskSerializer, ProjectSerializer
from analytics.models import AnalyticsRecord


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Project):
            return obj.owner == request.user or request.method in permissions.SAFE_METHODS
        if isinstance(obj, Sprint):
            return obj.project and obj.project.owner == request.user or request.method in permissions.SAFE_METHODS
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
        # Only list tasks within a project owned by the user, optionally scoped to sprint
        qs = Task.objects.select_related("project", "assigned_to__user", "sprint")
        project_id = self.request.query_params.get("project")
        sprint_id = self.request.query_params.get("sprint")
        if project_id:
            qs = qs.filter(project_id=project_id)
        if sprint_id:
            qs = qs.filter(sprint_id=sprint_id)
        return qs.filter(project__owner=self.request.user)

    def perform_create(self, serializer):
        # Require project to scope tasks and ensure visibility per-project
        project = serializer.validated_data.get("project")
        sprint = serializer.validated_data.get("sprint")
        if not project or project.owner != self.request.user:
            raise permissions.PermissionDenied("Invalid or unauthorized project.")
        if sprint:
            # Ensure sprint belongs to same project and owner
            if sprint.project_id != project.id or sprint.project.owner_id != self.request.user.id:
                raise permissions.PermissionDenied("Invalid sprint for this project.")
        serializer.save()

    def perform_update(self, serializer):
        prev: Task = self.get_object()
        # Validate sprint change if present
        sprint = serializer.validated_data.get("sprint")
        project = serializer.validated_data.get("project") or prev.project
        if sprint:
            if sprint.project_id != project.id or sprint.project.owner_id != self.request.user.id:
                raise permissions.PermissionDenied("Invalid sprint for this project.")
        updated: Task = serializer.save()
        # Handle completion tracking and timestamps
        was_done = prev.status == "done" or prev.completed
        is_done = updated.status == "done" or updated.completed
        if is_done and not was_done:
            # set completed_at if missing
            if not updated.completed_at:
                updated.completed_at = timezone.now()
                updated.completed = True
                updated.save(update_fields=["completed_at", "completed", "updated_at"])
            # write analytics record
            try:
                AnalyticsRecord.objects.create(
                    user=getattr(self.request.user, "userprofile", None),
                    action="task_completed",
                    details={
                        "task_id": updated.id,
                        "title": updated.title,
                        "project_id": updated.project_id,
                    },
                )
            except Exception:
                pass

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

    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        project_id = request.query_params.get("project")
        if not project_id:
            return Response({"detail": "project query param required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            project = Project.objects.get(id=project_id, owner=request.user)
        except Project.DoesNotExist:
            return Response({"detail": "Project not found"}, status=404)
        qs = project.tasks.all()
        total = qs.count()
        completed = qs.filter(status="done").count()
        in_progress = qs.filter(status__in=["progress", "review"]).count()
        progress = int(round((completed / total) * 100)) if total else 0
        # Team members count: default 4 as provided
        team_members = 4
        return Response({
            "total": total,
            "completed": completed,
            "in_progress": in_progress,
            "progress": progress,
            "team_members": team_members,
        })


class SprintViewSet(viewsets.ModelViewSet):
    queryset = Sprint.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    class SerializerClassPlaceholder:
        pass

    def get_serializer_class(self):
        # lightweight inline serializer to avoid creating a new file
        from rest_framework import serializers

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

        return SprintSerializer

    def get_queryset(self):
        return Sprint.objects.filter(project__owner=self.request.user).select_related("project").order_by("-created_at")

    def perform_create(self, serializer):
        project = serializer.validated_data.get("project")
        if not project or project.owner != self.request.user:
            raise permissions.PermissionDenied("Invalid or unauthorized project.")
        serializer.save()