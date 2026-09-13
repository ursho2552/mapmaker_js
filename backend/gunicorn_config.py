"""Gunicorn settings: `gunicorn --config gunicorn_config.py app:app`."""

import os

bind = f"0.0.0.0:{os.environ.get('API_PORT', 5000)}"

# The netCDF library only allows one read at a time per process (see
# datasets.py), so parallel requests need separate worker processes. Datasets
# are opened lazily, so an extra worker costs little memory.
workers = int(os.environ.get("WEB_CONCURRENCY", 3))

# A few threads per worker let requests queue in the process instead of the
# socket, and keep the worker responsive while one request reads a file.
worker_class = "gthread"
threads = 4

timeout = 120

# Log to the console, where Docker collects it.
accesslog = "-"
errorlog = "-"
