#!/bin/bash

echo "Building project..."
python3.11 -m pip install -r requirements.txt

echo "Collecting static files..."
python3.11 manage.py collectstatic --noinput

echo "Running migrations..."
python3.11 manage.py makemigrations --noinput
python3.11 manage.py migrate --noinput

echo "Build complete."
