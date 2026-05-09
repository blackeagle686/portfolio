"""
WSGI config for portfolio_project project.
"""

import os
import sys
from django.core.wsgi import get_wsgi_application

# Set settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_project.settings')

# Initialize application
application = get_wsgi_application()

# Auto-run migrations on startup for Serverless environments (Vercel)
if os.environ.get('VERCEL'):
    from django.core.management import call_command
    print("Running migrations on Vercel startup...")
    try:
        call_command('migrate', '--noinput')
        print("Migrations completed successfully.")
    except Exception as e:
        print(f"Migration error: {e}")
