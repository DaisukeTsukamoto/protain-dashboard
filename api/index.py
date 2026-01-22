"""
Vercel serverless function entry point for Django application
Based on Vercel's Python function standard format
"""
import os
import sys
import traceback
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
    try:
        # Extract request information from Vercel request dictionary
        # Handle both dict and object formats
        if isinstance(request, dict):
            method = request.get('method', 'GET')
            path = request.get('path', '/')
            query_string = request.get('queryStringParameters') or {}
            headers = request.get('headers') or {}
            body = request.get('body', '')
        else:
            # Handle object format (if Vercel passes an object)
            method = getattr(request, 'method', 'GET')
            path = getattr(request, 'path', '/')
            query_string = getattr(request, 'queryStringParameters', None) or {}
            headers = getattr(request, 'headers', None) or {}
            body = getattr(request, 'body', '')
        
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
        # Normalize headers to dict
        if not isinstance(headers, dict):
            headers = dict(headers) if hasattr(headers, '__iter__') else {}
        
        host = headers.get('host', 'localhost')
        content_type = headers.get('content-type', '')
        url_scheme = headers.get('x-forwarded-proto', 'https')
        
        environ = {
            'REQUEST_METHOD': method,
            'PATH_INFO': path,
            'QUERY_STRING': query_string_str,
            'CONTENT_TYPE': content_type,
            'CONTENT_LENGTH': str(len(body_bytes)),
            'SERVER_NAME': host.split(':')[0] if host else 'localhost',
            'SERVER_PORT': host.split(':')[1] if ':' in host else '80',
            'wsgi.version': (1, 0),
            'wsgi.url_scheme': url_scheme,
            'wsgi.input': BytesIO(body_bytes),
            'wsgi.errors': sys.stderr,
            'wsgi.multithread': False,
            'wsgi.multiprocess': True,
            'wsgi.run_once': False,
        }
        
        # Add HTTP headers to environ (convert to HTTP_* format)
        for key, value in headers.items():
            key_upper = key.upper().replace('-', '_')
            if key_upper not in ('CONTENT_TYPE', 'CONTENT_LENGTH', 'HOST'):
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
    except Exception as e:
        # Error handling - return error response
        error_traceback = traceback.format_exc()
        print(f"Error in handler: {str(e)}", file=sys.stderr)
        print(error_traceback, file=sys.stderr)
        
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'text/html; charset=utf-8'},
            'body': f'''
            <html>
            <head><title>Server Error</title></head>
            <body>
                <h1>Server Error</h1>
                <p>An error occurred while processing your request.</p>
                <pre>{str(e)}</pre>
                <pre>{error_traceback}</pre>
            </body>
            </html>
            '''
        }
