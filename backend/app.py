"""MAPMAKER backend.

Serves the plankton diversity and environmental projections to the React
frontend. Run in production as `gunicorn app:app` from this directory.
"""

import logging
import sys

import click
from flask import Flask
from flask_cors import CORS

from api import api
from config import API_HOST, API_PORT, DATA_URL
from data_files import check_data, sync_data

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)

app = Flask(__name__)
CORS(app)
app.register_blueprint(api)


@app.after_request
def disable_caching(response):
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


@app.cli.command("check-data")
def check_data_command():
    """List the data files the frontend can request that are missing."""
    sys.exit(1 if check_data() else 0)


@app.cli.command("sync-data")
@click.option("--url", default=DATA_URL, show_default="$DATA_URL",
              help="Directory listing to mirror the .nc files from.")
def sync_data_command(url):
    """Download new or changed .nc files from a remote directory into DATA_DIR."""
    if not url:
        raise click.UsageError("No URL: pass --url or set DATA_URL.")
    try:
        sync_data(url)
    except OSError as e:  # includes network and certificate errors
        logging.getLogger(__name__).error("Data sync from %s failed: %s", url, e)
        sys.exit(1)


if __name__ == "__main__":
    app.run(host=API_HOST, port=API_PORT, debug=False, threaded=True)
