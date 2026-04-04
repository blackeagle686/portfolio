from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.core.mail import send_mail
from .models import Service, Project, ServiceRequest, ContactMessage, ProjectMedia
from .forms import ServiceRequestForm, ContactForm, ProjectForm, ServiceForm
from django.contrib.admin.views.decorators import staff_member_required

def home(request):
    services = Service.objects.all()[:3]
    projects = Project.objects.all()[:3]
    return render(request, 'home.html', {'services': services, 'projects': projects})

def services_list(request):
    services = Service.objects.all()
    return render(request, 'services.html', {'services': services})

def service_detail(request, pk):
    service = get_object_or_404(Service, pk=pk)
    if request.method == 'POST':
        form = ServiceRequestForm(request.POST)
        if form.is_valid():
            service_request = form.save(commit=False)
            service_request.service = service
            service_request.save()
            messages.success(request, "Your request has been submitted successfully!")
            return redirect('service_detail', pk=pk)
    else:
        form = ServiceRequestForm(initial={'service': service})
    
    return render(request, 'service_detail.html', {'service': service, 'form': form})

def portfolio_list(request):
    projects = Project.objects.all()
    return render(request, 'portfolio.html', {'projects': projects})

def project_detail(request, pk):
    project = get_object_or_404(Project, pk=pk)
    return render(request, 'project_detail.html', {'project': project})

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            msg = form.save()
            
            # Dispatch secure email notification
            subject = f"Portfolio Contact: {msg.name}"
            email_body = f"New message from your Portfolio!\n\nName: {msg.name}\nEmail: {msg.email}\n\nMessage:\n{msg.message}"
            
            try:
                send_mail(
                    subject,
                    email_body,
                    'no-reply@portfolio.com',  # From Address
                    ['mathematecs1@gmail.com', 'mohammed.alaa.eldeen.686@gmail.com'], # Recipients
                    fail_silently=False,
                )
            except Exception as e:
                # Log local error if SMTP is not globally configured yet in settings.py, but don't break the user experience
                print(f"SMTP Error: {e}")

            messages.success(request, "Your message has been sent!")
            return redirect('contact')
    else:
        form = ContactForm()
    return render(request, 'contact.html', {'form': form})

@staff_member_required
def add_project(request):
    if request.method == 'POST':
        form = ProjectForm(request.POST, request.FILES)
        if form.is_valid():
            project = form.save()
            for f in request.FILES.getlist('additional_media'):
                ProjectMedia.objects.create(project=project, file=f)
            messages.success(request, "Project uploaded successfully!")
            return redirect('portfolio_list')
    else:
        form = ProjectForm()
    return render(request, 'add_project.html', {'form': form, 'is_edit': False})

@staff_member_required
def edit_project(request, pk):
    project = get_object_or_404(Project, pk=pk)
    if request.method == 'POST':
        form = ProjectForm(request.POST, request.FILES, instance=project)
        if form.is_valid():
            project = form.save()
            for f in request.FILES.getlist('additional_media'):
                ProjectMedia.objects.create(project=project, file=f)
            messages.success(request, "Project updated successfully!")
            return redirect('project_detail', pk=project.pk)
    else:
        form = ProjectForm(instance=project)
    return render(request, 'add_project.html', {'form': form, 'is_edit': True, 'project': project})

@staff_member_required
def add_service(request):
    if request.method == 'POST':
        form = ServiceForm(request.POST)
        if form.is_valid():
            service = form.save()
            messages.success(request, "Service created successfully!")
            return redirect('service_detail', pk=service.pk)
    else:
        form = ServiceForm()
    return render(request, 'add_service.html', {'form': form, 'is_edit': False})

@staff_member_required
def edit_service(request, pk):
    service = get_object_or_404(Service, pk=pk)
    if request.method == 'POST':
        form = ServiceForm(request.POST, instance=service)
        if form.is_valid():
            form.save()
            messages.success(request, "Service updated successfully!")
            return redirect('service_detail', pk=service.pk)
    else:
        form = ServiceForm(instance=service)
    return render(request, 'add_service.html', {'form': form, 'is_edit': True, 'service': service})

@staff_member_required
def delete_service(request, pk):
    service = get_object_or_404(Service, pk=pk)
    if request.method == 'POST':
        service.delete()
        messages.success(request, "Service deleted successfully!")
        return redirect('home')
    # If someone accesses via GET, just show the detail page or handle properly. 
    # Usually a confirmation page, but we'll use a fast post form in detail template.
    return redirect('service_detail', pk=service.pk)
