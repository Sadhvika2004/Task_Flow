"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""



from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework import routers
from tasks.views import TaskViewSet, ProjectViewSet
from users.views import UserProfileViewSet, AuthViewSet
from analytics.views import AnalyticsRecordViewSet

router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'users', UserProfileViewSet, basename='userprofile')
router.register(r'analytics', AnalyticsRecordViewSet, basename='analytics')
router.register(r'auth', AuthViewSet, basename='auth')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('', lambda request: HttpResponse('TaskFlow Management API is running.'), name='home'),
]
