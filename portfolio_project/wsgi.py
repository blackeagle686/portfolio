"""
WSGI config for portfolio_project project.
"""

import os
from django.core.wsgi import get_wsgi_application

# Set settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_project.settings')

# Initialize application
application = get_wsgi_application()

# Auto-run migrations and collectstatic on Vercel startup
if os.environ.get('VERCEL'):
    from django.core.management import call_command
    
    print("Vercel Startup: Preparing Database and Static Files...")
    try:
        # Run Migrations
        call_command('migrate', '--noinput')
        
        # Run Collectstatic
        call_command('collectstatic', '--noinput', '--clear')
        
        print("Vercel Startup: Success.")
    except Exception as e:
        print(f"Vercel Startup Error: {e}")
