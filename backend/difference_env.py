"""Generate the scenario differences (e.g. RCP85-RCP26) of the environmental files.

Writes them into DATA_DIR next to the inputs, where the backend looks for them.
"""
import xarray as xr
import os

from config import DATA_DIR

DATA_FOLDER = DATA_DIR
OUTPUT_FOLDER = DATA_DIR

os.makedirs(OUTPUT_FOLDER, exist_ok=True)

ENV_FILE_PATTERN = 'Env_var_annual_mean_{}_{}.nc'

ENVIRONMENTALS_VARIABLES = {
    'Temperature': 'SST',
    'Oxygen': 'dO2',
    'Change in Temperature': 'dSST',
    'Chlorophyll-a Concentration': 'logChl'
}

MODELS = ['Model_Mean', 'CNRM-CM5', 'GFDL-ESM2M', 'IPSL-CM5A-LR']

# (higher, lower) emission scenario: each output is higher minus lower.
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

        ds_high = xr.open_dataset(file_high)
        ds_low = xr.open_dataset(file_low)

        deltas = {}
        for var_name in ENVIRONMENTALS_VARIABLES.values():
            if var_name in ds_high and var_name in ds_low:
                deltas[var_name] = ds_high[var_name] - ds_low[var_name]
            else:
                print(f"Skipping missing variable {var_name} in {file_high} or {file_low}")

        delta_ds = xr.Dataset(deltas, coords=ds_high.coords)
        delta_ds.attrs = ds_high.attrs

        output_file = os.path.join(
            OUTPUT_FOLDER,
            f'Env_var_annual_mean_{model}_{scen_high}-{scen_low}.nc'
        )
        delta_ds.to_netcdf(output_file)

        print(f"Saved difference file: {output_file}")