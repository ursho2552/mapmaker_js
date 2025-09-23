// Tutorial steps
export const tooltips = [
    null, // Step 0: Welcome modal
    { // Step 1
        text: "You can compare different scenarios, models, and datasets side by side.",
        top: "30%",
        left: "50%",
    },
    { // Step 2
        text: "Each data panel allows you to switch between a flat map and a 3D globe for convenience.",
        top: "30%",
        left: "25%",
    },
    { // Step 3
        text: "Use the year slider to visualize changes over time.",
        top: "35%",
        left: "16%",
    },
    { // Step 4
        text: "Each panel has a corresponding control panel, where you can select the scenario, model, and other parameters to display.",
        top: "60%",
        left: "50%",
    },
    { // Step 5
        text: "Use locks to sync or separate panels. By default, the left and right data panels are synchronized, meaning the year, scenario, and model are linked. You can unlock these parameters individually if you want to compare different settings.",
        top: "65%",
        left: "50%",
    },
    { // Step 6
        text: "For any parameter, click on the info icons to learn more about its meaning and source.",
        top: "60%",
        left: "40%",
    },
    { // Step 7
        text: "You can select any point on the map or globe to explore how parameters evolve over time.",
        top: "75%",
        left: "17%",
    },
    { // Step 8
        text: "Observe the time series for the selected point.",
        top: "43%",
        left: "50%",
    }
];

// Colorbar label mapping
export const nameToLabelMapping = {
    'Biomes': 'Biome',
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

export const shortProjectDescription = "Marine plankton biodiversity is essential for ocean productivity, climate regulation, and biogeochemical cycles, but climate change threatens these critical ecosystem services. The MArine Plankton diversity bioindicator scenarios for policy MAKERs project mapped 859 plankton species, defined ocean biomes, projected biodiversity changes, and identified hotspots using observational data and machine learning. An interactive web tool visualizes these findings, helping policymakers incorporate plankton diversity into global marine management decisions.";

export const projectDescription = "Global marine biodiversity supplies essential ecosystem services to human societies. Marine plankton ecosystems fuel ocean productivity, drive global biogeochemical cycles and regulate the Earth's climate. Climate-mediated loss of biodiversity has been suggested to negatively impact ocean ecosystem services, but future projections of climate change impacts on biodiversity and ecosystem function are poorly constrained due to a lack of observational data. Hence, policy makers lack quantitative evidence on the vulnerability of marine ecosystems. The MArine Plankton diversity bioindicator scenarios for policy MAKERs project is a collaboration between IUCN Global Marine and Polar Programme and ETH Environmental Physics Group (UP) to inform data-driven decision-making on marine biodiversity protection at the international policy level and was financed through the Geneva Science Policy Interface (GSPI). Based on observational data and novel machine learning algorithms we have mapped the biogeography of 859 plankton species. We defined ocean biomes, projected future changes in biodiversity and identified hotspots of diversity change. The interactive web tool for policy makers visualizes the results on a global map and is the first step in narrowing the gap between science and policy makers in regard to plankton diversity and their impact on ecosystem functions to be incorporated in marine management decisions.";

export const infoMessagesShort = {
    // General descriptions
    'Diversity Indices general': 'Overview of diversity metrics based on habitat suitability.',
    'Plankton Groups general': 'Summary of 859 plankton species, split into zooplankton and phytoplankton.',
    'RCP Scenarios general': 'Explains IPCC climate pathways (RCPs) from low to high emissions.',
    'Earth System Models general': 'Describes climate models used to simulate Earth’s system interactions.',
    'Environmental Parameters general': 'Key ocean variables like temperature, oxygen, and chlorophyll-a.',

    // Diversity indices
    'Biomes': 'Ocean regions classified by plankton distribution using clustering methods.',
    'Species Richness': 'Shows proportion of species present using model-based thresholds.',
    'Hotspots of Change in Diversity': 'Annual species richness change compared to 2012–2030 baseline.',
    'Habitat Suitability Index (HSI)': 'Numerical index of habitat suitability averaged over species.',
    'Change in HSI': 'Yearly change in HSI relative to a baseline (2012–2030).',
    'Species Turnover': 'Change in species composition since 2012, based on Jaccard Index.',

    // Plankton groups
    'Total Plankton': 'Includes 859 species across 13 phyla and 324 genera.',
    'Zooplankton': '523 species from 8 phyla and 214 genera.',
    'Phytoplankton': '336 species across 5 phyla and 110 genera.',
    'Copepods': '272 copepod species from 4 orders and 85 genera.',
    'Diatoms': '154 species across 22 orders and 51 genera.',
    'Dinoflagellates': '154 species from 2 classes and 11 orders.',
    'Coccolithophores': '24 species across 3 classes and 8 orders.',

    // RCP scenarios
    'RCP 2.6 (Paris Agreement)': 'Low-emissions scenario with <2°C warming; high mitigation needed.',
    'RCP 4.5': 'Intermediate emissions; warming expected >2.5°C by 2100.',
    'RCP 8.5 (Business as Usual)': 'High-emissions scenario with >4°C warming; no policy intervention.',
    'RCP 8.5 - RCP 2.6': 'Difference between high and low emissions outcomes.',
    'RCP 8.5 - RCP 4.5': 'Difference between high and intermediate emissions outcomes.',
    'RCP 4.5 - RCP 2.6': 'Difference between intermediate and low emissions outcomes.',

    // Earth system models
    'Model Mean': 'Average of the three Earth System Models used.',
    'CNRM-CM5': 'Developed by CNRM-GAME and Cerfacs.',
    'GFDL-ESM2M': 'Model from the Geophysical Fluid Dynamics Lab.',
    'IPSL-CMSA-LR': 'Climate model from Institut Pierre Simon Laplace.',

    // Environmental parameters
    'Temperature': 'Sea surface temperature in °C.',
    'Oxygen': 'Dissolved oxygen in mg/L.',
    'Change in Temperature': 'Difference in SST from baseline conditions.',
    'Chlorophyll-a Concentration': 'Chlorophyll-a in mg/m³ (logarithmic scale).',
};

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
    'Species Turnover':
        "The species turnover represents the change in species composition compared to the species composition in the year 2012. We used the Jaccard Index, which results in a value between zero and one. High values close to one represent similar or identical species composition as in the year 2012.",

    // Plankton groups
    'Total Plankton':
        "In total, we included 859 marine plankton species. The datasets used were compiled by Righetti et al. (2018) and by Benedetti et al. (2018) and cover the range of 13 phyla, 71 orders, 147 families, and 324 genera.",
    'Zooplankton':
        "We projected the biogeography of 523 zooplankton species (61% of the total species). Within the category zooplankton, we cover the range of 8 phyla, 15 classes, 27 orders, and 214 genera.",
    'Phytoplankton':
        "We projected the biogeography of 336 phytoplankton species (39% of the total species). Within the category phytoplankton, we cover the range of 5 phyla, 15 classes, 44 orders, and 110 genera.",
    'Copepods':
        "We projected the biogeography of 272 copepod species (32% of the total species). The copepod dataset used covers 4 orders and 85 genera.",
    'Diatoms':
        "We projected the biogeography of 154 diatom species (18% of the total species) that cover the range of 22 orders and 51 genera.",
    'Dinoflagellates':
        "We projected the biogeography of 154 dinoflagellate species (18% of total species) that cover the range of two classes, 11 orders and 37 genera.",
    'Coccolithophores':
        "We projected the biogeography of 24 coccolithopore species (3% of total species) that cover the range of 3 classes, 8 orders and 18 genera.",

    // RCP scenarios
    'RCP 2.6 (Paris Agreement)':
        "The RCP 2.6 represents a low greenhouse gas emissions and high mitigation future scenario, which would likely limit global warming to below 2 degrees Celsius by the year 2100. The radiative forcing reaches a maximum near the middle of the twenty-first century. The scenario requires proactive environmental policy and sustainable production and consumption with low greenhouse gas emissions.",
    'RCP 4.5':
        "The RCP 4.5 represents an intermediate greenhouse gas emissions scenario. Global warming will be above 2.5 degree Celsius by the year 2100.",
    'RCP 8.5 (Business as Usual)':
        "The RCP 8.5 is a high greenhouse gas emissions scenario in the absence of policies to combat climate change, leading to continued and sustained growth in atmospheric greenhouse gas concentrations (business-as-usual scenario). Global warming will exceed 4 degrees Celsius by the year 2100.",
    'RCP 8.5 - RCP 2.6':
        "To see the differences between the high-emission scenario RCP 8.5 and the low-emission scenario RCP 2.6, we computed the difference by subtracting the corresponding chosen diversity index.",
    'RCP 8.5 - RCP 4.5':
        "To see the differences between the high-emission scenario RCP8.5 and the intermediate-emission scenario RCP4.5, we computed the difference by subtracting the corresponding chosen diversity index.",
    'RCP 4.5 - RCP 2.6':
        "To see the differences between the intermediate emission scenarion RCP 4.5 and the intermediate emission scenario RCP 2.6 we computed the difference by subtracting the corresponding diversity index chosen.",

    // Earth system models
    'Model Mean':
        "The model mean represents the averaged output of the three Earth System Models used.",
    'CNRM-CM5':
        "The general circulation model CNRM-CM has been developed jointly by CNRM-GAME (Centre National de Recherches Météorologiques, Groupe d'Études de l'Atmosphère Météorologique) and Cerfacs (Centre Européen de Recherche et de Formation Avancée).",
    'GFDL-ESM2M':
        "This model was developed at the Geophysical Fluid Dynamics Laboratory.",
    'IPSL-CMSA-LR':
        "This climate model was developed at the Institut Pierre Simon Laplace and is a classical climate model that couples an atmosphere-land surface model to an ocean-sea ice model.",

    // Environmental parameters
    "Temperature":
        'Sea Surface Temperature (SST) in degrees Celsius.',
    "Oxygen":
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