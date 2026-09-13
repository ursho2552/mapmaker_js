"""HTTP surface of the backend: thin handlers over `datasets` and the lookup tables."""

import logging
import os

from flask import Blueprint, jsonify, request
from werkzeug.exceptions import HTTPException

from config import FIRST_YEAR
from data_lookup_variables import get_environmental_data, get_file_and_variable
from datasets import get_timeseries, read_map, year_count

log = logging.getLogger(__name__)

api = Blueprint("api", __name__, url_prefix="/api")


class ApiError(Exception):
    """Error to report to the client, with the status code to send."""

    def __init__(self, message, status=400):
        super().__init__(message)
        self.message = message
        self.status = status


@api.errorhandler(ApiError)
def handle_api_error(error):
    return jsonify({"error": error.message}), error.status


@api.errorhandler(FileNotFoundError)
def handle_missing_file(error):
    log.error("Data file not found: %s", error.filename)
    name = os.path.basename(error.filename) if error.filename else "unknown"
    return jsonify({"error": f"Data file not available: {name}"}), 404


@api.errorhandler(Exception)
def handle_unexpected_error(error):
    if isinstance(error, HTTPException):
        return error
    log.exception("Unhandled error on %s", request.full_path)
    return jsonify({"error": "Internal server error"}), 500


def required_arg(name, type=str):
    value = request.args.get(name, type=type)
    if value is None or value == "":
        raise ApiError(f"Missing or invalid parameter: {name}")
    return value


def resolve(lookup, *args):
    """(file path, variable name) for the given choices, or a 400 for unknown ones."""
    try:
        return lookup(*args)
    except KeyError as e:
        raise ApiError(f"Unknown or missing option: {e.args[0]}") from e


def plankton_source():
    return resolve(
        get_file_and_variable,
        required_arg("index"),
        request.args.get("group", type=str),
        required_arg("scenario"),
        required_arg("model"),
    )


def environmental_source(parameter_arg):
    return resolve(
        get_environmental_data,
        required_arg(parameter_arg),
        required_arg("scenario"),
        required_arg("model"),
    )


def last_year(file_path, variable):
    return FIRST_YEAR + year_count(file_path, variable) - 1


def check_year(year, first, last, name="year"):
    if not first <= year <= last:
        raise ApiError(f"{name} {year} out of range {first}–{last}")


def map_response(file_path, variable):
    year = request.args.get("year", default=FIRST_YEAR, type=int)
    check_year(year, FIRST_YEAR, last_year(file_path, variable))
    return jsonify(read_map(file_path, variable, year))


@api.route("/globe-data", methods=["GET"])
def globe_data():
    # 'plankton' uses index and group; anything else is an environmental parameter.
    if request.args.get("source", "env") == "plankton":
        file_path, variable = plankton_source()
    else:
        file_path, variable = environmental_source("index")
    return map_response(file_path, variable)


@api.route("/map-data", methods=["GET"])
def map_data():
    return map_response(*plankton_source())


@api.route("/line-data", methods=["GET"])
def line_data():
    x = request.args.get("x", type=float)
    y = request.args.get("y", type=float)
    area = tuple(request.args.get(k, type=float) for k in ("xMin", "xMax", "yMin", "yMax"))

    if x is not None and y is not None:
        selection = {"point": (x, y)}
    elif None not in area:
        selection = {"area": area}
    else:
        raise ApiError("Either (x, y) or (xMin, xMax, yMin, yMax) must be provided")

    file_path, variable = plankton_source()
    file_path_env, variable_env = environmental_source("envParam")

    last = last_year(file_path, variable)
    year_start = request.args.get("startYear", default=FIRST_YEAR, type=int)
    year_end = request.args.get("endYear", default=last, type=int)
    check_year(year_start, FIRST_YEAR, last, "startYear")
    check_year(year_end, year_start, last, "endYear")

    return jsonify(get_timeseries(
        file_path, variable, file_path_env, variable_env,
        year_start, year_end, **selection,
    ))
