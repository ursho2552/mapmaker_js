"""Environment-derived settings for the MAPMAKER backend."""

import os
from pathlib import Path

# Directory holding the NetCDF files. Defaults to backend/data, wherever the
# backend is started from.
DATA_DIR = os.environ.get("DATA_DIR", str(Path(__file__).resolve().parent / "data"))

# Optional directory listing to mirror the NetCDF files from before starting
# (see entrypoint.sh). Empty means the files in DATA_DIR are used as they are.
DATA_URL = os.environ.get("DATA_URL", "")
DOWNLOAD_TIMEOUT_SECONDS = 120

# Address the development server (`python app.py`) binds to. In production
# gunicorn chooses its own bind address; see gunicorn_config.py.
API_HOST = os.environ.get("API_HOST", "127.0.0.1")
API_PORT = int(os.environ.get("API_PORT", 5000))

# First year in every projection file; time index 0 is this year.
FIRST_YEAR = 2012
