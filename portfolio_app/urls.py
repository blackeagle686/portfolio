from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('services/', views.services_list, name='services_list'),
    path('services/<int:pk>/', views.service_detail, name='service_detail'),
    path('services/add/', views.add_service, name='add_service'),
    path('services/<int:pk>/edit/', views.edit_service, name='edit_service'),
    path('services/<int:pk>/delete/', views.delete_service, name='delete_service'),
    path('portfolio/', views.portfolio_list, name='portfolio_list'),
    path('portfolio/<int:pk>/', views.project_detail, name='project_detail'),
    path('portfolio/<int:pk>/edit/', views.edit_project, name='edit_project'),
    path('portfolio/add/', views.add_project, name='add_project'),
    path('contact/', views.contact, name='contact'),
]
