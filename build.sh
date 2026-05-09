#!/bin/bash

echo "Building project..."
python3.11 -m pip install -r requirements.txt

echo "Collecting static files..."
python3.11 manage.py collectstatic --noinput

echo "Running migrations..."
python3.11 manage.py makemigrations --noinput
python3.11 manage.py migrate --noinput

# Set Default Superuser Credentials
export DJANGO_SUPERUSER_USERNAME="tlk@tlk.com"
export DJANGO_SUPERUSER_EMAIL="tlk@tlk.com"
export DJANGO_SUPERUSER_PASSWORD="tlk/1234/tlk.com"

echo "Creating superuser..."
python3.11 manage.py createsuperuser --noinput || true

echo "Build complete."
