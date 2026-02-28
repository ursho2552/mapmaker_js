import xarray as xr
import os

DATA_FOLDER = './data/'
OUTPUT_FOLDER = './data/env_diff/'

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Base environmental file pattern
ENV_FILE_PATTERN = 'Env_var_annual_mean_{}_{}.nc'

# Environmental variables
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
    for scen_high, scen_low in SCENARIO_DIFFS:
        file_high = os.path.join(DATA_FOLDER, ENV_FILE_PATTERN.format(model, scen_high))
        file_low = os.path.join(DATA_FOLDER, ENV_FILE_PATTERN.format(model, scen_low))

        if not os.path.exists(file_high) or not os.path.exists(file_low):
            print(f"Skipping missing files: {file_high}, {file_low}")
            continue

        print(f"Processing {model}: {scen_high}-{scen_low}")

        # Open datasets
        ds_high = xr.open_dataset(file_high)
        ds_low = xr.open_dataset(file_low)

        # Create an empty dict to hold deltas
        deltas = {}

        # Compute deltas only for variables that exist
        for var_name in ENVIRONMENTALS_VARIABLES.values():
            if var_name in ds_high and var_name in ds_low:
                deltas[var_name] = ds_high[var_name] - ds_low[var_name]
            else:
                print(f"Skipping missing variable {var_name} in {file_high} or {file_low}")

        # Preserve all original coordinates, including time_bnds
        coords = ds_high.coords

        # Create new dataset with all deltas
        delta_ds = xr.Dataset(deltas, coords=coords)

        # Keep attrs for metadata consistency
        delta_ds.attrs = ds_high.attrs

        # Save difference file
        output_file = os.path.join(
            OUTPUT_FOLDER,
            f'Env_var_annual_mean_{model}_{scen_high}-{scen_low}.nc'
        )
        delta_ds.to_netcdf(output_file)

        print(f"Saved difference file: {output_file}")