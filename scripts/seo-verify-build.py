"""Run the existing read-only crawl with its local production server in one session.

Requires an existing web production build. Uses no API mutations, credentials,
database commands, provider SDKs or hosted previews. Intended for POSIX/WSL.
"""
import argparse
import os
from pathlib import Path
import signal
import socket
import subprocess
import sys
import tempfile
import time


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=3012)
    parser.add_argument("--output", default="docs/seo/evidence/current-crawl-local-2026-09-21.json")
    args = parser.parse_args()
    if not 1024 <= args.port <= 65535:
        parser.error("Choose a local port between 1024 and 65535.")
    root = Path(__file__).resolve().parent.parent
    if not (root / "apps/web/.next/BUILD_ID").is_file():
        parser.error("Run npm run build --workspace apps/web first.")
    with socket.socket() as probe:
        try:
            probe.bind(("127.0.0.1", args.port))
        except OSError:
            parser.error("The selected local port is unavailable; do not test an unrelated server.")

    with tempfile.TemporaryFile(mode="w+b") as log:
        server = subprocess.Popen(
            ["npm", "run", "start", "--workspace", "apps/web", "--",
             "--port", str(args.port), "--hostname", "127.0.0.1"],
            cwd=root, stdout=log, stderr=subprocess.STDOUT, start_new_session=True,
        )
        try:
            deadline = time.monotonic() + 45
            while True:
                if server.poll() is not None:
                    raise RuntimeError("The local production server exited before readiness.")
                try:
                    with socket.create_connection(("127.0.0.1", args.port), timeout=0.3):
                        break
                except OSError:
                    if time.monotonic() >= deadline:
                        raise RuntimeError("Local server startup exceeded 45 seconds.")
                    time.sleep(0.1)
            result = subprocess.run(
                [sys.executable, "scripts/seo-local-qa.py", "--base-url",
                 f"http://127.0.0.1:{args.port}", "--output", args.output],
                cwd=root, check=False,
            )
            return result.returncode
        finally:
            # Only stop this invocation's isolated server process group.
            try:
                os.killpg(server.pid, signal.SIGTERM)
            except ProcessLookupError:
                pass
            try:
                server.wait(timeout=10)
            except subprocess.TimeoutExpired:
                os.killpg(server.pid, signal.SIGKILL)
                server.wait()


if __name__ == "__main__":
    raise SystemExit(main())
