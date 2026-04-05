import http.server
import socketserver
import sys

def run_server(start_port=8080):
    Handler = http.server.SimpleHTTPRequestHandler
    Handler.extensions_map.update({'.wasm': 'application/wasm'})
    socketserver.TCPServer.allow_reuse_address = True

    port = start_port
    while port < 8100:
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                print(f"Success! Challenge server active at http://localhost:{port}")
                print("Press Ctrl+C to stop.")
                httpd.serve_forever()
        except OSError as e:
            if e.errno == 98:
                port += 1
                continue
            else:
                print(f"Error: {e}")
                sys.exit(1)
        except KeyboardInterrupt:
            print("\nStopping server...")
            sys.exit(0)

if __name__ == "__main__":
    run_server()
