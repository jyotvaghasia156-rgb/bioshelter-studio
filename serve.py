#!/usr/bin/env python3
"""
BioShelter Studio - Local Development & Hosting Server
Serves the web application on http://localhost:8000 with CORS and clean MIME types.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers for smooth Three.js & ES Modules loading
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def run_server():
    os.chdir(DIRECTORY)
    # Allow port reuse
    socketserver.TCPServer.allow_reuse_address = True
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            url = f"http://localhost:{PORT}"
            print("=" * 70)
            print("  BioShelter Studio &bull; Thermal Comfort Modeling System")
            print("=" * 70)
            print(f"  Server running at: {url}")
            print("  Press Ctrl+C to stop the server.")
            print("=" * 70)
            
            # Optionally open default web browser
            try:
                webbrowser.open(url)
            except Exception:
                pass

            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except Exception as e:
        print(f"Error starting server: {e}")

if __name__ == '__main__':
    run_server()
