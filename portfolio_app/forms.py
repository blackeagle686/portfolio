from django import forms
from .models import ServiceRequest, ContactMessage, Project, Service

class ServiceRequestForm(forms.ModelForm):
    class Meta:
        model = ServiceRequest
        fields = ['client_name', 'email', 'service', 'project_description', 'budget', 'deadline']
        widgets = {
            'deadline': forms.DateInput(attrs={'type': 'date'}),
        }

class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'message']

class ServiceForm(forms.ModelForm):
    class Meta:
        model = Service
        fields = ['title', 'description', 'technologies', 'starting_price', 'delivery_time', 'basic_description', 'standard_description', 'premium_description']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Service Title (e.g. Full-Stack Dev)'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'Main service description...'}),
            'technologies': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'React, Python, Django...'}),
            'starting_price': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': '250.00'}),
            'delivery_time': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '1-2 Weeks'}),
            'basic_description': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'Basic Tier details...'}),
            'standard_description': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'Standard Tier details...'}),
            'premium_description': forms.Textarea(attrs={'class': 'form-control', 'rows': 2, 'placeholder': 'Premium Tier details...'}),
        }

class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True

    def value_from_datadict(self, data, files, name):
        val = super().value_from_datadict(data, files, name)
        # Bypass Django's FileField native "list" validation crash by feeding it only the first file.
        # The view handles `request.FILES.getlist()` separately anyway!
        if isinstance(val, list):
            return val[0] if val else None
        return val

class ProjectForm(forms.ModelForm):
    additional_media = forms.FileField(
        widget=MultipleFileInput(attrs={'class': 'form-control custom-file-upload'}), 
        required=False,
        help_text="Hold Ctrl/Cmd to select multiple files."
    )

    class Meta:
        model = Project
        fields = ['title', 'description', 'technologies', 'image', 'demo_link', 'github_link']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Project Title'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'Project Bio / Description'}),
            'technologies': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'React, Django, AI, etc.'}),
            'image': forms.FileInput(attrs={'class': 'form-control'}),
            'demo_link': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'https://demo.com'}),
            'github_link': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'https://github.com/username/repo'}),
        }
