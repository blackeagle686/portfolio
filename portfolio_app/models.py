from django.db import models

class Service(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    technologies = models.CharField(max_length=500, help_text="Comma separated technologies")
    starting_price = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_time = models.CharField(max_length=100)
    
    # Pricing tiers (simplified approach: could be a separate model, but keeping it simple as requested)
    basic_description = models.TextField(blank=True, null=True)
    standard_description = models.TextField(blank=True, null=True)
    premium_description = models.TextField(blank=True, null=True)
    
    @property
    def tech_list(self):
        if not self.technologies:
            return []
        return [t.strip() for t in self.technologies.split(',')]

    def __str__(self):
        return self.title

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    technologies = models.CharField(max_length=500)
    image = models.ImageField(upload_to='projects/')
    demo_link = models.URLField(blank=True, null=True)
    github_link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def tech_list(self):
        if not self.technologies:
            return []
        return [t.strip() for t in self.technologies.split(',')]

    def __str__(self):
        return self.title

class ProjectMedia(models.Model):
    project = models.ForeignKey(Project, related_name='media', on_delete=models.CASCADE)
    file = models.FileField(upload_to='projects/media/')
    
    def __str__(self):
        return f"Media for {self.project.title}"

class ServiceRequest(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    client_name = models.CharField(max_length=200)
    email = models.EmailField()
    project_description = models.TextField()
    budget = models.CharField(max_length=100)
    deadline = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_processed = models.BooleanField(default=False)

    def __str__(self):
        return f"Request from {self.client_name} for {self.service.title}"

class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name}"
