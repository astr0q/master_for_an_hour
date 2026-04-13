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
    path('requests/<int:request_id>/assign/', views.assign_master),
    path('requests/<int:request_id>/progress/', views.update_progress),
    path('requests/master/<int:master_id>/', views.get_master_jobs),
    path('masters/', views.get_masters),
    path('availability/', views.get_availability),
    path('availability/update/', views.update_availability),
]
