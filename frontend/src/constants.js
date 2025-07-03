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
        'Different diversity indices based on the Habitat Suitability Index.',
    'Plankton Groups general':
        'Marine taxonomic groupings important for global ecosystem services provided by our oceans. Total number of different species included were 859. Thereof 523 (~61%) zooplankton and 336 (~39%) phytoplankton species. Further species included were Copepods 272 (~32%), Diatoms 154 (~18%), Dinoflagelates 154 (~18%) and Coccolithophores 24 (~3%).',
    'RCP Scenarios general':
        'The Intergovernmental Panel on Climate Change provide policymakers with scientific assessments on climate change such as the published scenarios of greenhouse gas concentration and emission pathways called representative concentration pathways (RCPs). The different climate scenarios are labelled after their respective radiative forcing in the year 2100 (e.g. RCP8.5 Wm-2). At present, global carbon emissions are tracking just above the highest representative concentration pathway (RCP 8.5) while the RCP 2.6 scenario represents the lowest concentration pathway with high mitigation strategies.',
    'Earth System Models general':
        'Earth System Models (ESMs) are global climate models which represent biogeochemical processes that interact with the climate. The three different Earth System Models used are fully coupled models from the Coupled Model Inter- comparison Project (CMIP5) assessment.',
    'Environmental Parameters general':
        'Environmental parameters include variables like temperature, oxygen concentration, and chlorophyll-a.',

    // Diversity indices
    'Biomes':
        "The biomes were constructed based on yearly distribution maps of plankton species' presence derived from statistical species distribtuion model ensembles. This procedure was developed by Urs Hofmann Elizondo (2021) and partitions the open ocean into ecologically relevant biomes based on plankton species biogeography using self-organizing maps and hierarchical clustering.",
    'Species Richness':
        "Species richness displays the percentage of species present in regard to the selected plankton group. To display this biodiversity index, the habitat suitability index had to be transformed to presence and absence entries. To do so, we used the cut off threshold of the True Skill Statistic which was derived from the species distribution models. To convert each species to a presence or absence entry we use three trhesholds, namely the 25th, median and 75th percentile, derived from three different SDMs (Generalized Linear Model, Generalized Additive Model, Neural Network) that computed five evaluation runs each. We add the presences and computed the average of the new presence table.",
    'Hotspots of Change in Diversity':
        "This change in diversity is derived from the presence-absence converted data. To assess the change from the beginning until the end of the 21st century, we used a base diversity estimate that has been averaged over a period of eighteen years (2012-2030) that was subtracted from each year, 2012 - 2100. Therefore it shows the yearly difference in the relative number of species when comparing to our base diversity estimate and gives information on how species richness is about to change until the end of the century in regard to the chosen RCP emission scenario.",
    'Habitat Suitability Index (HSI)':
        "The Habitat Suitability Index (HSI) hypothesizes species-habitat relationships and is a numerical index that represents the capacity of a habitat to support a selected species. The species distribution framework used in this analysis was developed by Righetti et al. (2019) and Benedetti et al. (2018) to estimate plankton diversity patterns from an ensemble forecasting approach using three different algorithms namely Generalized Linear Models, Generalized Additive Models and Artificial Neural Networks. Depending on the group that is selected, the HSI has been summed up and divided by the total number of species in that particular group in order to scale it between zero and one. It therefore represents the averaged HSI for each group selected.",
    'Change in HSI':
        "This change in diversity is derived from the Habitat Suitability Index. To assess the change from the beginning until the end of the 21st century, we used a base Habitat Suitability Index estimate that has been averaged over a period of eighteen years (2012-2030) that was subtracted from each year, 2012 - 2100. Therefore it shows the yearly difference in the Habitat Suitability Index when comparing to our base Habitat Suitability Index estimate and gives information on how much this index is about to change until the end of the century in regard to the chosen RCP emission scenario.",
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