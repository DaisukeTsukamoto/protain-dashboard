"""
Vercel serverless function entry point for Django application
Based on Vercel's Python function standard format
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

# Get WSGI application (cached for performance)
wsgi_application = get_wsgi_application()


def handler(request):
    """
    Vercel serverless function handler
    Vercel passes request as a dictionary with the following structure:
    {
        'method': 'GET',
        'path': '/',
        'queryStringParameters': {},
        'headers': {},
        'body': ''
    }
    """
    # Extract request information from Vercel request dictionary
    method = request.get('method', 'GET')
    path = request.get('path', '/')
    query_string = request.get('queryStringParameters') or {}
    headers = request.get('headers') or {}
    body = request.get('body', '')
    
    # Build query string
    if query_string:
        query_parts = [f"{k}={v}" for k, v in query_string.items()]
        query_string_str = '&'.join(query_parts)
    else:
        query_string_str = ''
    
    # Convert body to bytes if it's a string
    if isinstance(body, str):
        body_bytes = body.encode('utf-8')
    else:
        body_bytes = body or b''
    
    # Build WSGI environ dictionary
    environ = {
        'REQUEST_METHOD': method,
        'PATH_INFO': path,
        'QUERY_STRING': query_string_str,
        'CONTENT_TYPE': headers.get('content-type', ''),
        'CONTENT_LENGTH': str(len(body_bytes)),
        'SERVER_NAME': headers.get('host', 'localhost').split(':')[0] if headers.get('host') else 'localhost',
        'SERVER_PORT': headers.get('host', 'localhost').split(':')[1] if ':' in headers.get('host', '') else '80',
        'wsgi.version': (1, 0),
        'wsgi.url_scheme': headers.get('x-forwarded-proto', 'https'),
        'wsgi.input': BytesIO(body_bytes),
        'wsgi.errors': sys.stderr,
        'wsgi.multithread': False,
        'wsgi.multiprocess': True,
        'wsgi.run_once': False,
    }
    
    # Add HTTP headers to environ (convert to HTTP_* format)
    for key, value in headers.items():
        key_upper = key.upper().replace('-', '_')
        if key_upper not in ('CONTENT_TYPE', 'CONTENT_LENGTH'):
            environ[f'HTTP_{key_upper}'] = value
    
    # Create Django WSGI request
    django_request = WSGIRequest(environ)
    
    # Get response from Django
    response = wsgi_application.get_response(django_request)
    
    # Get response body
    if hasattr(response, 'content'):
        body_content = response.content
    else:
        body_content = b''.join(response)
    
    # Convert response headers to dictionary
    response_headers = {}
    for header, value in response.items():
        response_headers[header] = value
    
    # Return response in Vercel format
    return {
        'statusCode': response.status_code,
        'headers': response_headers,
        'body': body_content.decode('utf-8', errors='ignore')
    }
