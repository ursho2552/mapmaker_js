#Dictionary to store the path to the data based on user choices
BIOMES_FILE = './data/MAPMAKER_Biomes_Data_file_v2.nc'
BIOMES_VARIABLES = {'RCP26': 'annual_biomes_RCP26',
                    'RCP45': 'annual_biomes_RCP45',
                    'RCP85': 'annual_biomes_RCP85'}

TURNOVER_FILE = './data/jaccardIndex_{}_{}.nc'
TURNOVER_VARIABLES = {'Total Plankton': 'jaccardTot',
                        'Phytoplankton': 'jaccardPhyto',
                        'Zooplankton': 'jaccardZoo',
                        'Coccolithophores': 'jaccardCoccolith',
                        'Copepods': 'jaccardCopepods',
                        'Diatoms': 'jaccardDiat',
                        'Dinoflagellates': 'jaccardDinofl'}

HSI_FILE = './data/Species_Data_for_App_{}_{}.nc'
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

RICHNESS_FILE = './data/Presence_Data_for_App_{}_{}.nc'
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

ENVIRONMENTAL_FILE = './data/Env_var_annual_mean_{}_{}.nc'
ENVIRONMENTAL_FILE_DIFF = './data/env_diff/Env_var_annual_mean_{}_{}.nc'

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