"""
Vercel serverless function entry point for Django application
Vercel expects a WSGI application object exported as 'app'
"""
import os
import sys
import traceback
from pathlib import Path

# Add the project root to the Python path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'protain_dashboard.settings')

# Initialize Django
try:
    import django
    django.setup()
    
    from django.core.wsgi import get_wsgi_application
    
    # Get WSGI application
    application = get_wsgi_application()
    
    # Vercel expects 'app' to be exported
    app = application
    
except Exception as e:
    # Log initialization error
    error_traceback = traceback.format_exc()
    print(f"Django initialization error: {str(e)}", file=sys.stderr)
    print(error_traceback, file=sys.stderr)
    # Create a minimal error app
    def error_app(environ, start_response):
        start_response('500 Internal Server Error', [('Content-Type', 'text/html')])
        return [f'<h1>Django Initialization Error</h1><pre>{error_traceback}</pre>'.encode()]
    app = error_app
