"""
Vercel serverless function entry point for Django application
"""
import os
import sys
from pathlib import Path

# Add the project root to the Python path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'protain_dashboard.settings')

# Initialize Django
import django
django.setup()

from django.core.wsgi import get_wsgi_application

# Vercel expects 'app' to be exported
app = get_wsgi_application()
