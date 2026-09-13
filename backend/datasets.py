"""Reading the NetCDF projections: map slices and time series.

Datasets are opened once per file and kept open. Opening is lazy, so the cache
holds file handles and metadata, not the data itself.
"""

import logging
from contextlib import contextmanager
from threading import Lock

import numpy as np
import xarray as xr

from config import FIRST_YEAR

log = logging.getLogger(__name__)

_datasets = {}

# The netCDF/HDF5 C library is not thread-safe: two threads touching any netCDF
# files at the same time (even different ones) can crash the process. All
# dataset access therefore goes through this one lock.
netcdf_lock = Lock()

# Min/max of a variable across all years, keyed by (file_path, variable_name).
# Computing them reads the whole variable, so each one is computed only once.
_value_ranges = {}


@contextmanager
def open_dataset(file_path: str):
    """The cached dataset for `file_path`, used while holding `netcdf_lock`."""
    with netcdf_lock:
        if file_path not in _datasets:
            log.info("Opening dataset: %s", file_path)
            _datasets[file_path] = xr.open_dataset(file_path)
        yield _datasets[file_path]


def year_count(file_path: str, variable_name: str):
    """Number of years (time steps) stored for a variable."""
    with open_dataset(file_path) as ds:
        return ds[variable_name].shape[0]


def _value_range(ds, file_path: str, variable_name: str):
    """Min/max of a variable across all years. Call while holding `netcdf_lock`."""
    key = (file_path, variable_name)
    if key not in _value_ranges:
        variable = ds[variable_name]
        _value_ranges[key] = (variable.min().item(), variable.max().item())
    return _value_ranges[key]


def read_map(file_path: str, variable_name: str, year: int):
    """The grid of one variable in one year, with the colour scale to draw it."""
    with open_dataset(file_path) as ds:
        min_value, max_value = _value_range(ds, file_path, variable_name)
        if 'div' in variable_name:
            # Changes are drawn on a diverging scale centred on zero.
            abs_value = max(abs(min_value), abs(max_value))
            min_value = -abs_value
            max_value = abs_value

        variable = ds[variable_name][year - FIRST_YEAR, :, :].values
        variable = np.where(np.isnan(variable), None, variable.round(2))

        return {
            'lats': ds['lat'].values.tolist(),
            'lons': ds['lon'].values.tolist(),
            'variable': variable.tolist(),
            'colorscale': 'Picnic' if 'div' in variable_name else 'Viridis',
            'minValue': round(min_value, 2),
            'maxValue': round(max_value, 2)
        }


def _series(ds, variable_name, point, area, year_slice):
    """Values of a variable at a point, or its mean over an area, per year.

    Returns (values, std): for an area, std is the standard error of the area mean;
    for a point, zeros.
    """
    variable = ds[variable_name]

    if point is not None:
        x, y = point
        values = variable.sel(lat=y, lon=x, method="nearest")
        std = None
    else:
        x_min, x_max, y_min, y_max = area
        # Latitudes may be stored north to south.
        if ds.lat.values[0] > ds.lat.values[-1]:
            lat_slice = slice(y_max, y_min)
        else:
            lat_slice = slice(y_min, y_max)

        region = variable.sel(lat=lat_slice, lon=slice(x_min, x_max))
        values = region.mean(dim=["lat", "lon"])
        std = region.std(dim=["lat", "lon"])

    values = values[year_slice].compute()
    values = np.where(np.isnan(values), None, values.round(2))

    if std is not None:
        std = std[year_slice].compute()
        std = np.where(np.isnan(std), None, std.round(2))
        std /= len(values) ** 0.5
    else:
        std = np.zeros_like(values)

    return values, std


def _trend_line(years, values):
    """Least-squares linear trend, or [None] when any value is missing."""
    if values.tolist().count(None) != 0:
        return [None]
    trend = np.polyfit(years, values.astype(float), 1)
    return np.polyval(trend, years).tolist()


def get_timeseries(file_path: str, variable_name: str,
                   file_path_env: str, variable_name_env: str,
                   year_start: int, year_end: int,
                   point=None, area=None):
    """Time series of a plankton variable and an environmental variable.

    Pass either `point` as (x, y) or `area` as (x_min, x_max, y_min, y_max).
    """
    year_slice = slice(year_start - FIRST_YEAR, year_end - FIRST_YEAR + 1)
    years = np.arange(year_start, year_end + 1).astype(float)

    with open_dataset(file_path) as ds:
        values, std = _series(ds, variable_name, point, area, year_slice)
    # Biomes are categories, so a trend through them means nothing.
    trend = [None] if "biomes" in variable_name else _trend_line(years, values)

    with open_dataset(file_path_env) as ds_env:
        values_env, std_env = _series(ds_env, variable_name_env, point, area, year_slice)
    trend_env = _trend_line(years, values_env)

    return {
        "years": years.tolist(),
        "variable": {
            "name": variable_name,
            "values": values.tolist(),
            "std": std.tolist(),
            "trend": trend,
        },
        "environmental_variable": {
            "name": variable_name_env,
            "values": values_env.tolist(),
            "std": std_env.tolist(),
            "trend": trend_env,
        },
    }
