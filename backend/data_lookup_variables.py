"""Maps the choices made in the frontend onto NetCDF files and variable names.

Lookups raise KeyError for an option that does not exist; the API reports that
as a bad request.
"""

import os

from config import DATA_DIR

BIOMES_FILE = 'MAPMAKER_Biomes_Data_file_v2.nc'
BIOMES_VARIABLES = {'RCP26': 'annual_biomes_RCP26',
                    'RCP45': 'annual_biomes_RCP45',
                    'RCP85': 'annual_biomes_RCP85'}

TURNOVER_FILE = 'jaccardIndex_{}_{}.nc'
TURNOVER_VARIABLES = {'Total Plankton': 'jaccardTot',
                        'Phytoplankton': 'jaccardPhyto',
                        'Zooplankton': 'jaccardZoo',
                        'Coccolithophores': 'jaccardCoccolith',
                        'Copepods': 'jaccardCopepods',
                        'Diatoms': 'jaccardDiat',
                        'Dinoflagellates': 'jaccardDinofl'}

HSI_FILE = 'Species_Data_for_App_{}_{}.nc'
HSI_VARIABLES = {'Total Plankton': 'hsiTot',
                'Phytoplankton': 'hsiPhyto',
                'Zooplankton': 'hsiZoo',
                'Coccolithophores': 'hsiCoccolith',
                'Copepods': 'hsiCopepods',
                'Diatoms': 'hsiDiat',
                'Dinoflagellates': 'hsiDinofl'}

DELTA_HSI_VARIABLES = {'Total Plankton': 'hsi_hotspot_div_changeTot',
                        'Phytoplankton': 'hsi_hotspot_div_changePhyto',
                        'Zooplankton': 'hsi_hotspot_div_changeZoo',
                        'Coccolithophores': 'hsi_hotspot_div_changeCoccolith',
                        'Copepods': 'hsi_hotspot_div_changeCopepods',
                        'Diatoms': 'hsi_hotspot_div_changeDiat',
                        'Dinoflagellates': 'hsi_hotspot_div_changeDinofl'}

RICHNESS_FILE = 'Presence_Data_for_App_{}_{}.nc'
RICHNESS_VARIABLES = {'Total Plankton': 'spRichTot',
                        'Phytoplankton': 'spRichPhyto',
                        'Zooplankton': 'spRichZoo',
                        'Coccolithophores': 'spRichCoccolith',
                        'Copepods': 'spRichCopepods',
                        'Diatoms': 'spRichDiat',
                        'Dinoflagellates': 'spRichDinofl'}
DIVERSITY_VARIABLES = {'Total Plankton': 'hotspot_div_changeTot',
                        'Phytoplankton': 'hotspot_div_changePhyto',
                        'Zooplankton': 'hotspot_div_changeZoo',
                        'Coccolithophores': 'hotspot_div_changeCoccolith',
                        'Copepods': 'hotspot_div_changeCopepods',
                        'Diatoms': 'hotspot_div_changeDiat',
                        'Dinoflagellates': 'hotspot_div_changeDinofl'}

# Plankton index -> (file name template, variables per plankton group).
# Biomes are handled separately: one file, with one variable per scenario.
PLANKTON_INDICES = {'Species Richness': (RICHNESS_FILE, RICHNESS_VARIABLES),
                    'Hotspots of Change in Diversity': (RICHNESS_FILE, DIVERSITY_VARIABLES),
                    'Habitat Suitability Index (HSI)': (HSI_FILE, HSI_VARIABLES),
                    'Change in HSI': (HSI_FILE, DELTA_HSI_VARIABLES),
                    'Species Turnover': (TURNOVER_FILE, TURNOVER_VARIABLES)}

ENVIRONMENTAL_FILE = 'Env_var_annual_mean_{}_{}.nc'

ENVIRONMENTALS_VARIABLES = {'Temperature': 'SST',
                            'Oxygen': 'dO2',
                            'Change in Temperature': 'dSST',
                            'Chlorophyll-a Concentration': 'logChl'}

SCENARIOS = {'RCP 2.6 (Paris Agreement)': 'RCP26',
            'RCP 4.5': 'RCP45',
            'RCP 8.5 (Business as Usual)': 'RCP85',
            'RCP 8.5 - RCP 2.6': 'RCP85-RCP26',
            'RCP 8.5 - RCP 4.5': 'RCP85-RCP45',
            'RCP 4.5 - RCP 2.6': 'RCP45-RCP26'}

ESMS = {'Model Mean': 'Model_Mean',
        'CNRM-CM5': 'CNRM-PISCES',
        'GFDL-ESM2M': 'GFDL-TOPAZ',
        'IPSL-CMSA-LR': 'IPSL-PISCES'}

ESMS_ENV = {'Model Mean': 'Model_Mean',
        'CNRM-CM5': 'CNRM-CM5',
        'GFDL-ESM2M': 'GFDL-ESM2M',
        'IPSL-CMSA-LR': 'IPSL-CM5A-LR'}


def get_environmental_data(env_parameter: str, scenario: str, model: str):
    """(file path, variable name) of an environmental parameter."""
    file_name = ENVIRONMENTAL_FILE.format(ESMS_ENV[model], SCENARIOS[scenario])
    return os.path.join(DATA_DIR, file_name), ENVIRONMENTALS_VARIABLES[env_parameter]


def get_file_and_variable(index: str, group: str, scenario: str, model: str):
    """(file path, variable name) of a plankton index for one group."""
    if index == 'Biomes':
        return os.path.join(DATA_DIR, BIOMES_FILE), BIOMES_VARIABLES[SCENARIOS[scenario]]

    file_template, variables = PLANKTON_INDICES[index]
    file_name = file_template.format(ESMS[model], SCENARIOS[scenario])
    return os.path.join(DATA_DIR, file_name), variables[group]
