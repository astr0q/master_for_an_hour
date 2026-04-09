from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('services/', views.get_services),
    path('requests/', views.get_requests),
    path('requests/create/', views.create_request),
    path('requests/<int:request_id>/status/', views.update_status),
]