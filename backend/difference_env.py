import xarray as xr
import os

DATA_FOLDER = './data/'
OUTPUT_FOLDER = './data/env_diff/'

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Base environmental file pattern
ENV_FILE_PATTERN = 'Env_var_annual_mean_{}_{}.nc'

# Environmental parameters
ENVIRONMENTALS_VARIABLES = {
    'Temperature': 'SST',
    'Oxygen': 'dO2',
    'Change in Temperature': 'dSST',
    'Chlorophyll-a Concentration': 'logChl'
}

# Models
MODELS = ['Model_Mean', 'CNRM-CM5', 'GFDL-ESM2M', 'IPSL-CM5A-LR']

# Scenario differences to compute
SCENARIO_DIFFS = [
    ('RCP85', 'RCP26'),
    ('RCP85', 'RCP45'),
    ('RCP45', 'RCP26')
]

for model in MODELS:
    for env_param, var_name in ENVIRONMENTALS_VARIABLES.items():
        for scen_high, scen_low in SCENARIO_DIFFS:
            file_high = os.path.join(DATA_FOLDER, ENV_FILE_PATTERN.format(model, scen_high))
            file_low = os.path.join(DATA_FOLDER, ENV_FILE_PATTERN.format(model, scen_low))

            if not os.path.exists(file_high) or not os.path.exists(file_low):
                print(f"Skipping missing files: {file_high}, {file_low}")
                continue

            print(f"Processing {env_param} for {model}: {scen_high}-{scen_low}")

            # Open datasets
            ds_high = xr.open_dataset(file_high)
            ds_low = xr.open_dataset(file_low)

            # Calculate difference
            delta = ds_high[var_name] - ds_low[var_name]

            # Create new dataset
            delta_ds = xr.Dataset({var_name: delta}, coords=ds_high.coords)

            # Save difference file in the separate folder
            output_file = os.path.join(
                OUTPUT_FOLDER,
                f'Env_var_annual_mean_{model}_{scen_high}-{scen_low}.nc'
            )
            delta_ds.to_netcdf(output_file)

            print(f"Saved difference file: {output_file}")
