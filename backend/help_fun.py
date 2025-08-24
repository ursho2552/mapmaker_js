import xarray as xr
ds = xr.open_dataset('./data/Env_var_annual_mean_Model_Mean_RCP85.nc')
print("Data format check prior:")
print(ds.data_vars)

ds = xr.open_dataset('./data/env_diff/Env_var_annual_mean_Model_Mean_RCP85-RCP26.nc')
print("Data format check after:")
print(ds.data_vars)