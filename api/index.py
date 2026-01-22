"""
Vercel serverless function entry point for Django application
"""
import os
import sys
from pathlib import Path
from io import BytesIO

# Add the project root to the Python path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'protain_dashboard.settings')

# Import Django
import django
django.setup()

from django.core.wsgi import get_wsgi_application
from django.core.handlers.wsgi import WSGIRequest

# Get WSGI application
wsgi_application = get_wsgi_application()


def handler(request):
    """
    Vercel serverless function handler
    Converts Vercel request to Django WSGI request and returns response
    """
    # Extract request information from Vercel request
    method = request.get('method', 'GET')
    path = request.get('path', '/')
    query_string = request.get('queryStringParameters', {}) or {}
    headers = request.get('headers', {}) or {}
    body = request.get('body', '')
    
    # Build query string
    if query_string:
        query_parts = [f"{k}={v}" for k, v in query_string.items()]
        query_string_str = '&'.join(query_parts)
    else:
        query_string_str = ''
    
    # Build WSGI environ
    environ = {
        'REQUEST_METHOD': method,
        'PATH_INFO': path,
        'QUERY_STRING': query_string_str,
        'CONTENT_TYPE': headers.get('content-type', ''),
        'CONTENT_LENGTH': str(len(body)) if body else '0',
        'SERVER_NAME': headers.get('host', 'localhost').split(':')[0],
        'SERVER_PORT': headers.get('host', 'localhost').split(':')[1] if ':' in headers.get('host', '') else '80',
        'wsgi.version': (1, 0),
        'wsgi.url_scheme': headers.get('x-forwarded-proto', 'https'),
        'wsgi.input': BytesIO(body.encode('utf-8') if isinstance(body, str) else body),
        'wsgi.errors': sys.stderr,
        'wsgi.multithread': False,
        'wsgi.multiprocess': True,
        'wsgi.run_once': False,
    }
    
    # Add HTTP headers to environ
    for key, value in headers.items():
        key = key.upper().replace('-', '_')
        if key not in ('CONTENT_TYPE', 'CONTENT_LENGTH'):
            environ[f'HTTP_{key}'] = value
    
    # Create Django request
    django_request = WSGIRequest(environ)
    
    # Get response from Django
    response = wsgi_application.get_response(django_request)
    
    # Convert Django response to Vercel response format
    response_headers = {}
    for header, value in response.items():
        response_headers[header] = value
    
    # Get response body
    if hasattr(response, 'content'):
        body_content = response.content
    else:
        body_content = b''.join(response)
    
    return {
        'statusCode': response.status_code,
        'headers': response_headers,
        'body': body_content.decode('utf-8', errors='ignore')
    }
