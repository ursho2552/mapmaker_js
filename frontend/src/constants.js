// Data and presentation constants. Copy lives in content.js, helpers in utils.js.

// Tutorial steps that explain the locks, and the info icons of the left control panel
export const LOCK_TUTORIAL_STEP = 5;
export const CONTROL_PANEL_TUTORIAL_STEP = 6;

/** First and last year of every projection. */
export const FIRST_YEAR = 2012;
export const LAST_YEAR = 2100;

// Equirectangular Earth image drawn under the map and globe data
export const EARTH_TEXTURE = '/assets/earth_texture.png';

// Colorbar label mapping
export const nameToLabelMapping = {
    'Biomes': 'Biomes',
    'Species Richness': 'Species Richness [% species]',
    'Hotspots of Change in Diversity': 'Diversity changes [%]',
    'Habitat Suitability Index (HSI)': 'HSI [%]',
    'Change in HSI': 'ΔHSI [%]',
    'Species Turnover': 'Jaccard Index [-]',
    'Temperature': 'Temperature [°C]',
    'Change in Temperature': 'ΔTemperature [°C]',
    'Oxygen': 'Oxygen [mg/L]',
    'Chlorophyll-a Concentration': 'Chlorophyll-a Concentration [log(mg/m³)]',
};

// Color palettes
export const differenceColors = [
    '#3b4cc0',
    '#4f6ec5',
    '#6390cb',
    '#7ab1d3',
    '#9ad0dc',
    '#d6d6d6',
    '#e7b6b6',
    '#db8d8d',
    '#cd6464',
    '#b40426'
];

export const sequentialColors = [
    '#440154',
    '#482777',
    '#3b528b',
    '#31688e',
    '#21918c',
    '#35b779',
    '#5ec962',
    '#aadc32',
    '#dde318',
    '#fde725'
];

export const temperatureColors = [
    '#313695',
    '#4575b4',
    '#74add1',
    '#abd9e9',
    '#e0f3f8',
    '#f7f7f7',
    '#fee090',
    '#fdae61',
    '#f46d43',
    '#d73027',
    '#a50026'
];

export const diversityIndices = [
    'Biomes',
    'Species Richness',
    'Hotspots of Change in Diversity',
    'Habitat Suitability Index (HSI)',
    'Change in HSI',
    'Species Turnover',
];

export const planktonGroups = [
    'Total Plankton',
    'Zooplankton',
    'Phytoplankton',
    'Copepods',
    'Diatoms',
    'Dinoflagellates',
    'Coccolithophores',
];

export const rcpScenarios = [
    'RCP 2.6 (Paris Agreement)',
    'RCP 4.5',
    'RCP 8.5 (Business as Usual)',
    'RCP 8.5 - RCP 2.6',
    'RCP 8.5 - RCP 4.5',
    'RCP 4.5 - RCP 2.6',
];

export const earthModels = ['Model Mean', 'CNRM-CM5', 'GFDL-ESM2M', 'IPSL-CMSA-LR'];

export const environmentalParameters = [
    'Temperature',
    'Oxygen',
    'Change in Temperature',
    'Chlorophyll-a Concentration',
];

export const logos = [
    {
        alt: 'ETH Zurich',
        src: '/assets/ETH_logo_black.png',
        href: 'https://up.ethz.ch/research/ongoing-projects.html',
    },
    {
        alt: 'GSPI',
        src: '/assets/GSPI_logo_black.png',
        href: 'https://gspi.ch/collaboration_projec/marine-plankton-diversity-bioindicator-scenarios-for-policy-makers-mapmaker/',
    },
    {
        alt: 'IUCN',
        src: '/assets/IUCN_logo_black.png',
        href: 'https://www.iucn.org/theme/marine-and-polar',
    },
    {
        alt: 'CMIP5 Data Archive',
        src: '/assets/CMIP5_logo_black.png',
        href: 'https://esgf-node.llnl.gov/search/cmip5/',
    },
    {
        alt: 'Appsilon',
        src: '/assets/appsilon_logo_black.png',
        href: 'https://www.appsilon.com/',
    }
];
