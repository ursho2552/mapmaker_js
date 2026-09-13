#!/bin/sh
# Container start: optionally mirror the data, report missing files, start gunicorn.

if [ -n "$DATA_URL" ]; then
    # A failed sync is not fatal: the files already in DATA_DIR are still served.
    flask --app app sync-data || echo "Data sync from $DATA_URL failed; using the files in $DATA_DIR"
fi

# Only a warning: the rest of the app works with some files missing.
flask --app app check-data || true

exec gunicorn --config gunicorn_config.py app:app
