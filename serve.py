#!/usr/bin/env python3
"""Tiny static file server for the downloaded Garden Club London site.

Serves this folder at http://127.0.0.1:8000/ and sends "/" to the homepage,
mirroring how Vercel serves it in production (see vercel.json).

Run with:  python3 serve.py
Stop with: Ctrl+C
"""
import http.server
import os
import socketserver

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 8000
HOME = "/gardenclublondon.co.uk/"

# chdir first so the handler serves from the project root regardless of the
# directory the process was launched from.
os.chdir(ROOT)


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            self.send_response(302)
            self.send_header("Location", HOME)
            self.end_headers()
            return
        super().do_GET()


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    print(f"Serving {ROOT} at http://127.0.0.1:{PORT}/")
    httpd.serve_forever()
