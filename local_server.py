from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


class CleanUrlRequestHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        parsed = urlparse(path)
        requested_path = parsed.path

        if requested_path == "/":
            requested_path = "/index.html"
        elif not requested_path.endswith("/") and "." not in Path(requested_path).name:
            requested_path = f"{requested_path}.html"

        return super().translate_path(requested_path)


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", 8001), CleanUrlRequestHandler).serve_forever()