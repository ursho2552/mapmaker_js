"""MAPMAKER backend.

Serves the plankton diversity and environmental projections to the React
frontend. Run in production as `gunicorn app:app` from this directory.
"""

import logging

from flask import Flask
from flask_cors import CORS

from api import api
from config import API_HOST, API_PORT

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


if __name__ == "__main__":
    app.run(host=API_HOST, port=API_PORT, debug=False, threaded=True)
