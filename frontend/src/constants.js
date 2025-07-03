// Colorbar label mapping
export const colorbarLabelMapping = {
    'Biomes': 'Biome [INSERT BIOMES LABEL]',
    'Species Richness': 'Species Richness [% species]',
    'Hotspots of Change in Diversity': 'Diversity changes [%]',
    'Habitat Suitability Index (HSI)': 'HSI [%]',
    'Change in HSI': 'ΔHSI [%]',
    'Species Turnover': 'Jaccard Index [-]',
    'Temperature': 'Temperature [°C]',
    'Change in Temperature': 'ΔTemperature [Δ°C]',
    'Oxygen': 'Oxygen [mg/L]',
    'Chlorophyll-a Concentration': 'Chlorophyll-a Concentration [log(mg/m³)]',
};

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
    'RCP 8.5 - RCP2.6',
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

export const projectDescription = "Global marine biodiversity supplies essential ecosystem services to human societies. Marine plankton ecosystems fuel ocean productivity, drive global biogeochemical cycles and regulate the Earth's climate. Climate-mediated loss of biodiversity has been suggested to negatively impact ocean ecosystem services, but future projections of climate change impacts on biodiversity and ecosystem function are poorly constrained due to a lack of observational data. Hence, policy makers lack quantitative evidence on the vulnerability of marine ecosystems. The MArine Plankton diversity bioindicator scenarios for policy MAKERs project is a collaboration between IUCN Global Marine and Polar Programme and ETH Environmental Physics Group (UP) to inform data-driven decision-making on marine biodiversity protection at the international policy level and was financed through the Geneva Science Policy Interface (GSPI). Based on observational data and novel machine learning algorithms we have mapped the biogeography of 859 plankton species. We defined ocean biomes, projected future changes in biodiversity and identified hotspots of diversity change. The interactive web tool for policy makers visualizes the results on a global map and is the first step in narrowing the gap between science and policy makers in regard to plankton diversity and their impact on ecosystem functions to be incorporated in marine management decisions.";

export const infoMessages = {
    // General descriptions
    'Diversity Indices general':
        'Select from several indices that capture different aspects of marine plankton biodiversity.',
    'Plankton Groups general':
        '"Marine taxonomic groupings important for global ecosystem services provided by our oceans. Total number of different species included were 859. Thereof 523 (~61%) zooplankton and 336 (~39%) phytoplankton species. Further species included were Copepods 272 (~32%), Diatoms 154 (~18%), Dinoflagelates 154 (~18%) and Coccolithophores 24 (~3%).',
    'RCP Scenarios general':
        'Representative Concentration Pathways (RCP) describe greenhouse gas concentration trajectories adopted by the IPCC.',
    'Earth System Models general':
        'Select Earth System Models used to simulate climate and biogeochemical processes.',
    'Environmental Parameters general':
        'Environmental parameters include variables like temperature, oxygen concentration, and chlorophyll-a.',

    // Diversity indices
    'Biomes': 'Biomes refer to distinct biological communities that have formed in response to a shared physical climate.',
    'Species Richness': 'Species richness is the number of different species represented in an ecological community, landscape or region.',
    'Hotspots of Change in Diversity': 'Hotspots of change in diversity indicate areas where significant changes in species diversity are occurring.',
    'Habitat Suitability Index (HSI)': 'HSI is an index that represents the suitability of a given habitat for a species or group of species.',
    'Change in HSI': 'Change in Habitat Suitability Index tracks how suitable a habitat is for species over time.',
    'Species Turnover': 'Species turnover refers to the rate at which one species replaces another in a community over time.',

    // Plankton groups
    'Total Plankton': 'Total Plankton includes all microscopic organisms, including both phytoplankton and zooplankton.',
    'Zooplankton': 'Zooplankton are small drifting animals in the water, including species such as jellyfish and crustaceans.',
    'Phytoplankton': 'Phytoplankton are microscopic marine algae that form the foundation of the ocean food web.',
    'Copepods': 'Copepods are a type of small crustacean found in nearly every freshwater and saltwater habitat.',
    'Diatoms': 'Diatoms are a group of microalgae that are known for their unique silica-based cell walls.',
    'Dinoflagellates': 'Dinoflagellates are a type of plankton responsible for phenomena like red tides and bioluminescence.',
    'Coccolithophores': 'Coccolithophores are single-celled marine algae surrounded by a microscopic plating made of calcium carbonate.',

    // RCP scenarios
    'RCP 2.6 (Paris Agreement)': 'RCP 2.6 is a scenario that assumes global annual greenhouse gas emissions peak between 2010–2020 and decline substantially thereafter.',
    'RCP 4.5': 'RCP 4.5 is an intermediate scenario where emissions peak around 2040, then decline.',
    'RCP 8.5 (Business as Usual)': 'RCP 8.5 is a high greenhouse gas emission scenario often considered the "business as usual" pathway.',
    'RCP 8.5 - RCP2.6': 'This difference shows the projected climate outcomes between the high-emission RCP 8.5 and the low-emission RCP 2.6 scenario.',
    'RCP 8.5 - RCP 4.5': 'This scenario shows the differences between the high-emission RCP 8.5 and moderate-emission RCP 4.5 pathways.',
    'RCP 4.5 - RCP 2.6': 'This scenario compares the moderate-emission RCP 4.5 and low-emission RCP 2.6 pathways.',

    // Earth system models
    'Model Mean': 'The Model Mean represents the average outcome across multiple climate models, providing a consensus projection.',
    'CNRM-CM5': 'CNRM-CM5 is a global climate model developed by Météo-France in collaboration with other research institutions.',
    'GFDL-ESM2M': 'GFDL-ESM2M is a coupled climate model developed by NOAA’s Geophysical Fluid Dynamics Laboratory.',
    'IPSL-CMSA-LR': 'IPSL-CMSA-LR is a climate model developed by the Institut Pierre-Simon Laplace, used for climate projections.',

    // Environmental parameters
    Temperature:
        'Sea Surface Temperature (SST) in degrees Celsius.',
    Oxygen:
        'Dissolved oxygen concentration in mg/L.',
    'Change in Temperature':
        'Difference in sea surface temperature compared to baseline conditions.',
    'Chlorophyll-a Concentration':
        'Chlorophyll-a concentration in mg/m³ on a logarithmic scale.',
};

export const logos = [
    {
        alt: 'ETH Zurich',
        src: '/assets/ETH_logo.png',
        href: 'https://up.ethz.ch/research/ongoing-projects.html',
    },
    {
        alt: 'GSPI',
        src: '/assets/GSPI_logo.png',
        href: 'https://gspi.ch/collaboration_projec/marine-plankton-diversity-bioindicator-scenarios-for-policy-makers-mapmaker/',
    },
    {
        alt: 'IUCN',
        src: '/assets/IUCN_logo.png',
        href: 'https://www.iucn.org/theme/marine-and-polar',
    },
    {
        alt: 'CMIP5 Data Archive',
        src: '/assets/CMIP5_Data_Archive_3.png',
        href: 'https://esgf-node.llnl.gov/search/cmip5/',
    },
    {
        alt: 'Appsilon',
        src: '/assets/Appsilon_logo.png',
        href: 'https://www.appsilon.com/',
    }
];

export const mapGlobeTitleStyle = {
    position: 'absolute',
    top: 13,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    color: 'white',
    height: 60,
    fontSize: 17,
    fontWeight: 'normal',
    textAlign: 'center',
    pointerEvents: 'none',
    userSelect: 'none',
    zIndex: 10,
    whiteSpace: 'normal',
    lineHeight: 1.3,
};