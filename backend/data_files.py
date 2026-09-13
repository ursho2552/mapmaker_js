"""Keeping DATA_DIR complete: checking for missing files and mirroring a remote copy.

Both run before the server starts (see entrypoint.sh) and are also available as
`flask --app app check-data` and `flask --app app sync-data`.
"""

import logging
import os
import re
import tempfile
import urllib.request
from email.utils import parsedate_to_datetime
from urllib.parse import urljoin

from config import DATA_DIR, DOWNLOAD_TIMEOUT_SECONDS
from data_lookup_variables import (
    ENVIRONMENTALS_VARIABLES, ESMS, ESMS_ENV, PLANKTON_INDICES, RICHNESS_VARIABLES,
    SCENARIOS, get_environmental_data, get_file_and_variable,
)

log = logging.getLogger(__name__)

CHUNK_BYTES = 1 << 20  # 1 MB


def required_files():
    """Names of every NetCDF file the frontend can request."""
    names = set()
    for scenario in SCENARIOS:
        for model in ESMS:
            for index in [*PLANKTON_INDICES, 'Biomes']:
                for group in RICHNESS_VARIABLES:
                    try:
                        names.add(os.path.basename(get_file_and_variable(index, group, scenario, model)[0]))
                    except KeyError:
                        pass  # e.g. Biomes only exist for the plain scenarios
        for model in ESMS_ENV:
            for parameter in ENVIRONMENTALS_VARIABLES:
                names.add(os.path.basename(get_environmental_data(parameter, scenario, model)[0]))
    return sorted(names)


def missing_files():
    return [name for name in required_files() if not os.path.exists(os.path.join(DATA_DIR, name))]


def check_data():
    """Log which required files are missing. Returns the number missing."""
    missing = missing_files()
    if not missing:
        log.info("All %d data files present in %s", len(required_files()), DATA_DIR)
        return 0

    log.warning("%d of %d data files missing from %s:", len(missing), len(required_files()), DATA_DIR)
    for name in missing:
        log.warning("  %s", name)
    if any(re.search(r"^Env_var_.*_RCP\d\d-RCP\d\d\.nc$", name) for name in missing):
        log.warning("Scenario differences of the environmental files can be generated "
                    "with `python difference_env.py`.")
    return len(missing)


def _remote_nc_files(data_url):
    """File names of the .nc files in an Apache-style directory listing."""
    with urllib.request.urlopen(data_url, timeout=DOWNLOAD_TIMEOUT_SECONDS) as response:
        listing = response.read().decode("utf-8", errors="replace")
    return sorted(set(re.findall(r'href="([^"?/]+\.nc)"', listing)))


def _is_up_to_date(local_path, remote_size, remote_mtime):
    if not os.path.exists(local_path):
        return False
    stat = os.stat(local_path)
    return stat.st_size == remote_size and (remote_mtime is None or stat.st_mtime >= remote_mtime)


def _download(url, target_path, remote_mtime):
    """Stream `url` to a temporary file, then move it into place atomically."""
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".part", dir=os.path.dirname(target_path))
    try:
        with urllib.request.urlopen(url, timeout=DOWNLOAD_TIMEOUT_SECONDS) as response:
            while chunk := response.read(CHUNK_BYTES):
                tmp.write(chunk)
        tmp.close()
        os.chmod(tmp.name, 0o644)  # temporary files are created owner-only
        if remote_mtime is not None:
            os.utime(tmp.name, (remote_mtime, remote_mtime))
        os.replace(tmp.name, target_path)
    except BaseException:
        tmp.close()
        os.unlink(tmp.name)
        raise


def sync_data(data_url):
    """Mirror the .nc files listed at `data_url` into DATA_DIR.

    Only files that are new, or whose size or modification time changed, are
    downloaded. Local files that are not on the remote are left alone. Returns
    the number of files downloaded.
    """
    data_url = data_url.rstrip("/") + "/"
    os.makedirs(DATA_DIR, exist_ok=True)
    names = _remote_nc_files(data_url)
    log.info("Syncing %d files from %s into %s", len(names), data_url, DATA_DIR)

    downloaded = 0
    for name in names:
        url = urljoin(data_url, name)
        with urllib.request.urlopen(urllib.request.Request(url, method="HEAD"),
                                    timeout=DOWNLOAD_TIMEOUT_SECONDS) as head:
            remote_size = int(head.headers.get("Content-Length", -1))
            last_modified = head.headers.get("Last-Modified")
        remote_mtime = parsedate_to_datetime(last_modified).timestamp() if last_modified else None

        local_path = os.path.join(DATA_DIR, name)
        if _is_up_to_date(local_path, remote_size, remote_mtime):
            continue

        log.info("Downloading %s (%.1f MB)", name, remote_size / 1e6)
        _download(url, local_path, remote_mtime)
        downloaded += 1

    log.info("Sync done: %d downloaded, %d already up to date", downloaded, len(names) - downloaded)
    return downloaded
