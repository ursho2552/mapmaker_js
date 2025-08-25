from flask import Flask, jsonify, request, make_response
from flask_cors import CORS  # Ensure this import is correct
import xarray as xr
import numpy as np
from threading import Lock
from flask_executor import Executor  # Import Flask-Executor

from data_lookup_variables import *

app = Flask(__name__)
# Apply CORS to the entire application
CORS(app)
file_lock = Lock()
executor = Executor(app)  # Initialize Flask-Executor

@app.after_request
def add_header(response):
    response.cache_control.no_store = True  # Disable caching for all responses
    return response

def read_netcdf(file_path: str, variable_name: str, year: int = None):
    if year is None:
        year = 2012

    file_lock.acquire()  # Acquire the lock to handle file concurrency
    try:
        # Open the dataset with Dask chunking
        with xr.open_dataset(file_path, chunks={'time': 10}) as ds:
            lats = ds['lat']
            lons = ds['lon']

            # Calculate min and max values across all years, lazily, and compute them
            min_value = ds[variable_name].min().compute()
            max_value = ds[variable_name].max().compute()
            if 'div' in variable_name:
                abs_value = max(abs(min_value), abs(max_value))
                min_value = -abs_value
                max_value = abs_value

            # Load the data for the specified year and compute the variable array
            variable = ds[variable_name][year - 2012, :, :].compute().values
            variable = np.where(np.isnan(variable), None, variable.round(2))
            colorscale = 'Picnic' if 'div' in variable_name else 'Viridis'

            data = {
                'lats': lats.values.tolist(),
                'lons': lons.values.tolist(),
                'variable': variable.tolist(),
                'colorscale': colorscale,
                'minValue': min_value.round(2).item(),
                'maxValue': max_value.round(2).item()
            }
    finally:
        file_lock.release()  # Always release the lock after the operation is done

    return data


def get_timeseries(file_path: str, variable_name: str, x: int, y: int,
                    year_start: int = 2012, year_end: int = 2100,
                    file_path_env: str = None, variable_name_env: str = None):
    file_lock.acquire()
    try:
        with xr.open_dataset(file_path) as ds:
            variable = ds[variable_name]
            data_at_point = variable.sel(lat=y, lon=x, method='nearest')

            year_start_index = year_start - 2012
            year_end_index = year_end - 2012 + 1
            variable = data_at_point[year_start_index:year_end_index].compute()
            variable = np.where(np.isnan(variable), None, variable.round(2))

            # Compute the trend line using linear regression
            years = np.arange(year_start, year_end + 1).astype(float)
            valid_data = np.array(variable)

            if valid_data.tolist().count(None) == 0 and not 'biomes' in variable_name:
                trend = np.polyfit(years, valid_data.astype(float), 1)  # 1st-degree polynomial (linear)
                trend_line = np.polyval(trend, years).tolist()
            else:
                trend_line = [None]

        # Get the environmental data if available
        if file_path_env is not None:
            with xr.open_dataset(file_path_env) as ds_env:
                variable_env = ds_env[variable_name_env]
                data_at_point_env = variable_env.sel(lat=y, lon=x, method='nearest')

                variable_env = data_at_point_env[year_start_index:year_end_index].compute()
                variable_env = np.where(np.isnan(variable_env), None, variable_env.round(2))

                valid_data_env = np.array(variable_env)

                if valid_data_env.tolist().count(None) == 0:
                    trend_env = np.polyfit(years, valid_data_env.astype(float), 1)
                    trend_line_env = np.polyval(trend_env, years).tolist()
                else:
                    trend_line_env = [None]

        data = {
            "data": [
                {
                    "type": "scatter",
                    "x": years.tolist(),
                    "y": valid_data.tolist(),
                    "mode": "lines+markers",
                    "name": variable_name,
                    "line": {"color": "white"}
                },
                {
                    "type": "scatter",
                    "x": years.tolist(),
                    "y": valid_data_env.tolist(),
                    "mode": "lines+markers",
                    "name": variable_name_env,
                    "line": {"color": "grey"}
                },
                {
                    "type": "scatter",
                    "x": years.tolist(),
                    "y": trend_line,
                    "mode": "lines",
                    "name": f"{variable_name} trend",
                    "line": {"dash": "dot", "color": "white"}
                },
                {
                    "type": "scatter",
                    "x": years.tolist(),
                    "y": trend_line_env,
                    "mode": "lines",
                    "name": f"{variable_name_env} trend",
                    "line": {"dash": "dot", "color": "grey"}
                }
            ]
        }
    finally:
        file_lock.release()

    return data


def get_environmental_data(env_parameter:str, scenario:str, model:str):

    decoded_model = ESMS_ENV[model]
    decoded_scenario = SCENARIOS[scenario]
    if '-' in decoded_scenario:
        file_path = ENVIRONMENTAL_FILE_DIFF.format(decoded_model, decoded_scenario)
    else:
        file_path = ENVIRONMENTAL_FILE.format(decoded_model, decoded_scenario)
    variable = ENVIRONMENTALS_VARIABLES[env_parameter]

    return file_path, variable

def get_file_and_variable(index:str, group:str, scenario:str, model:str):

    decoded_model = ESMS[model]
    decoded_scenario = SCENARIOS[scenario]

    if index == 'Biomes':
        decoded_scenario = SCENARIOS[scenario]
        file_path = BIOMES_FILE
        variable = BIOMES_VARIABLES[decoded_scenario]

    elif index == 'Species Richness':
        file_path = RICHNESS_FILE.format(decoded_model, decoded_scenario)
        variable = RICHNESS_VARIABLES[group]

    elif index == 'Hotspots of Change in Diversity':
        file_path = RICHNESS_FILE.format(decoded_model, decoded_scenario)
        variable = DIVERSITY_VARIABLES[group]

    elif index == 'Habitat Suitability Index (HSI)':
        file_path = HSI_FILE.format(decoded_model, decoded_scenario)
        variable = HSI_VARIABLES[group]

    elif index == 'Change in HSI':
        file_path = HSI_FILE.format(decoded_model, decoded_scenario)
        variable = DELTA_HSI_VARIABLES[group]

    elif index == 'Species Turnover':
        file_path = TURNOVER_FILE.format(decoded_model, decoded_scenario)
        variable = TURNOVER_VARIABLES[group]

    return file_path, variable

@app.route('/api/globe-data', methods=['GET'])
def get_globe_data():
    # Determine source type: 'env' for environmental, 'plankton' for diversity data
    source = request.args.get('source', 'env')
    year = request.args.get('year', type=int)
    scenario = request.args.get('scenario', type=str)
    model = request.args.get('model', type=str)

    if source == 'plankton':
        # Diversity/plankton data uses 'index' and 'group'
        index = request.args.get('index', type=str)
        group = request.args.get('group', type=str)
        file_path, variable = get_file_and_variable(index, group, scenario, model)
    else:
        # Environmental data uses 'index' as parameter name
        index = request.args.get('index', type=str)
        file_path, variable = get_environmental_data(index, scenario, model)

    # Run the data processing asynchronously
    future = executor.submit(read_netcdf, file_path, variable, year)
    data = future.result()

    response = jsonify(data)
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

@app.route('/api/map-data', methods=['GET'])
def get_map_data():

    year = request.args.get('year', type=int)  # Get the year parameter
    index = request.args.get('index', type=str)  # Get the index parameter
    group = request.args.get('group', type=str)
    scenario = request.args.get('scenario', type=str)
    model = request.args.get('model', type=str)

    file_path, variable = get_file_and_variable(index, group, scenario, model)

    # Run the data processing asynchronously
    future = executor.submit(read_netcdf, file_path, variable, year)
    data = future.result()  # Wait for the result

    response = jsonify(data)
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

    print(f"Response length: {len(response.get_data(as_text=True))}")
    return response

@app.route('/api/line-data', methods=['GET'])
def get_line_data():

    x = request.args.get('x', type=float)
    y = request.args.get('y', type=float)
    year_start = request.args.get('startYear', type=int)
    year_end = request.args.get('endYear', type=int)

    index = request.args.get('index', type=str)  # Get the index parameter
    group = request.args.get('group', type=str)
    scenario = request.args.get('scenario', type=str)
    model = request.args.get('model', type=str)
    env_parameter = request.args.get('envParam', type=str)

    file_path, variable = get_file_and_variable(index, group, scenario, model)
    file_path_env, variable_env = get_environmental_data(env_parameter, scenario, model)

    # Run the timeseries processing asynchronously
    future = executor.submit(get_timeseries, file_path, variable, x, y, year_start, year_end, file_path_env, variable_env)
    data = future.result()  # Wait for the result

    response = jsonify(data)
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

if __name__ == '__main__':
    app.run(debug=False, threaded=True)  # Enable threaded mode