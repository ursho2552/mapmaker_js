import React, { useState, useMemo } from 'react';
import GlobeDisplay from './components/GlobeDisplay';
import MapDisplay from './components/MapDisplay';
import CombinedLinePlot from './components/CombinedLinePlot';
import Footer from './components/Footer';
import _ from 'lodash';
import './App.css';

// MUI v5 imports
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider as MuiSlider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Link,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// DROPDOWN OPTIONS
const diversityIndices = [
  'Biomes',
  'Species Richness',
  'Hotspots of Change in Diversity',
  'Habitat Suitability Index (HSI)',
  'Change in HSI',
  'Species Turnover',
];
const planktonGroups = [
  'Total Plankton',
  'Zooplankton',
  'Phytoplankton',
  'Copepods',
  'Diatoms',
  'Dinoflagellates',
  'Coccolithophores',
];
const rcpScenarios = [
  'RCP 2.6 (Paris Agreement)',
  'RCP 4.5',
  'RCP 8.5 (Business as Usual)',
  'RCP 8.5 - RCP2.6',
  'RCP 8.5 - RCP 4.5',
  'RCP 4.5 - RCP 2.6',
];
const earthModels = ['Model Mean', 'CNRM-CM5', 'GFDL-ESM2M', 'IPSL-CMSA-LR'];
const environmentalParameters = [
  'Temperature',
  'Oxygen',
  'Change in Temperature',
  'Chlorophyll-a Concentration',
];

// -----------------------------------------------------------------------------
// “Explanation” HELP TEXT (unchanged)
// -----------------------------------------------------------------------------
const diversityMessages = {
  Biomes:
    'Biomes refer to distinct biological communities that have formed in response to a shared physical climate.',
  'Species Richness':
    'Species richness is the number of different species represented in an ecological community, landscape or region.',
  'Hotspots of Change in Diversity':
    'Hotspots of change in diversity indicate areas where significant changes in species diversity are occurring.',
  'Habitat Suitability Index (HSI)':
    'HSI is an index that represents the suitability of a given habitat for a species or group of species.',
  'Change in HSI':
    'Change in Habitat Suitability Index tracks how suitable a habitat is for species over time.',
  'Species Turnover':
    'Species turnover refers to the rate at which one species replaces another in a community over time.',
};

const planktonMessages = {
  'Total Plankton':
    'Total Plankton includes all microscopic organisms, including both phytoplankton and zooplankton.',
  Zooplankton:
    'Zooplankton are small drifting animals in the water, including species such as jellyfish and crustaceans.',
  Phytoplankton:
    'Phytoplankton are microscopic marine algae that form the foundation of the ocean food web.',
  Copepods:
    'Copepods are a type of small crustacean found in nearly every freshwater and saltwater habitat.',
  Diatoms: 'Diatoms are a group of microalgae that are known for their unique silica-based cell walls.',
  Dinoflagellates:
    'Dinoflagellates are a type of plankton responsible for phenomena like red tides and bioluminescence.',
  Coccolithophores:
    'Coccolithophores are single-celled marine algae surrounded by a microscopic plating made of calcium carbonate.',
};

const rcpMessages = {
  'RCP 2.6 (Paris Agreement)':
    'RCP 2.6 is a scenario that assumes global annual greenhouse gas emissions peak between 2010–2020 and decline substantially thereafter.',
  'RCP 4.5':
    'RCP 4.5 is an intermediate scenario where emissions peak around 2040, then decline.',
  'RCP 8.5 (Business as Usual)':
    'RCP 8.5 is a high greenhouse gas emission scenario often considered the "business as usual" pathway.',
  'RCP 8.5 - RCP2.6':
    'Difference between RCP 8.5 and RCP 2.6; highlights the contrast between high-emission and stringent mitigation pathways.',
  'RCP 8.5 - RCP 4.5':
    'Difference between RCP 8.5 and RCP 4.5; shows the impact of extreme versus intermediate emission trajectories.',
  'RCP 4.5 - RCP 2.6':
    'Difference between RCP 4.5 and RCP 2.6; illustrates the benefits of intermediate versus stringent mitigation scenarios.',
};

const modelMessages = {
  'Model Mean':
    'The Model Mean represents the average outcome across multiple climate models, providing a consensus projection.',
  'CNRM-CM5':
    'CNRM-CM5 is a global climate model developed by Météo-France in collaboration with other research institutions.',
  'GFDL-ESM2M':
    'GFDL-ESM2M is a coupled climate model developed by NOAA’s Geophysical Fluid Dynamics Laboratory.',
  'IPSL-CMSA-LR':
    'IPSL-CMSA-LR is a climate model developed by the Institut Pierre-Simon Laplace, used for climate projections.',
};

// ──────────────────────────────────────────────────────────────────────────────
// APP COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
const App = () => {
  // ── Main states ──
  const [selectedDiversity, setSelectedDiversity] = useState(diversityIndices[1]);
  const [selectedPlankton, setSelectedPlankton] = useState(planktonGroups[0]);
  const [selectedRCP, setSelectedRCP] = useState(rcpScenarios[0]);
  const [selectedModel, setSelectedModel] = useState(earthModels[0]);
  const [selectedEnvParam, setSelectedEnvParam] = useState(environmentalParameters[0]);

  // ── Panel 1 states ──
  const [panel1Year, setPanel1Year] = useState(2012);
  const [panel1DebouncedYear, setPanel1DebouncedYear] = useState(2012);
  const [panel1Source, setPanel1Source] = useState('plankton'); // “plankton” or “environmental”
  const [panel1View, setPanel1View] = useState('map'); // “map” or “globe”
  const [panel1EnvParam, setPanel1EnvParam] = useState(environmentalParameters[0]);
  const [panel1Diversity, setPanel1Diversity] = useState(selectedDiversity);
  const [panel1Group, setPanel1Group] = useState(selectedPlankton);
  const [panel1RCP, setPanel1RCP] = useState(selectedRCP);
  const [panel1Model, setPanel1Model] = useState(selectedModel);

  // ── Panel 2 states ──
  const [panel2Year, setPanel2Year] = useState(2012);
  const [panel2DebouncedYear, setPanel2DebouncedYear] = useState(2012);
  const [panel2Source, setPanel2Source] = useState('environmental');
  const [panel2View, setPanel2View] = useState('globe');
  const [panel2EnvParam, setPanel2EnvParam] = useState(environmentalParameters[0]);
  const [panel2Diversity, setPanel2Diversity] = useState(selectedDiversity);
  const [panel2Group, setPanel2Group] = useState(selectedPlankton);
  const [panel2RCP, setPanel2RCP] = useState(selectedRCP);
  const [panel2Model, setPanel2Model] = useState(selectedModel);

  // ── Modal states ──
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalText, setInfoModalText] = useState('');
  const [refsModalOpen, setRefsModalOpen] = useState(false);

  // ── Combined line chart point ──
  const [selectedPoint, setSelectedPoint] = useState({ x: null, y: null });
  const endYear = 2100;

  // ── Debounced year changes ──
  const debouncedUpdatePanel1 = useMemo(
    () => _.debounce((newYear) => setPanel1DebouncedYear(newYear), 500),
    []
  );
  const debouncedUpdatePanel2 = useMemo(
    () => _.debounce((newYear) => setPanel2DebouncedYear(newYear), 500),
    []
  );

  // ── Handlers ──
  const handlePointClick = (x, y) => {
    setSelectedPoint({ x, y });
  };

  const openInfoModal = (category) => {
    let text = '';
    if (category.endsWith(' general')) {
      const key = category.replace(/ general$/, '');
      switch (key) {
        case 'Diversity Indices':
          text = 'Different diversity indices based on the Habitat Suitability Index.';
          break;
        case 'Plankton Groups':
          text =
            'Marine taxonomic groupings important for global ecosystem services provided by our oceans.';
          break;
        case 'RCP Scenarios':
          text =
            'Representative Concentration Pathways describe greenhouse gas trajectories and radiative forcing scenarios.';
          break;
        case 'Earth System Models':
          text =
            'Earth System Models are coupled climate-biogeochemical models used for projecting environmental changes.';
          break;
        default:
          text = 'No information available';
      }
    } else {
      if (diversityMessages[category]) text = diversityMessages[category];
      else if (planktonMessages[category]) text = planktonMessages[category];
      else if (rcpMessages[category]) text = rcpMessages[category];
      else if (modelMessages[category]) text = modelMessages[category];
      else text = 'No information available';
    }
    setInfoModalText(text);
    setInfoModalOpen(true);
  };
  const closeInfoModal = () => setInfoModalOpen(false);
  const openRefsModal = () => setRefsModalOpen(true);
  const closeRefsModal = () => setRefsModalOpen(false);

  // ── Filtering logic for “Biomes” (unchanged) ──
  const filteredRcpScenarios = selectedDiversity === 'Biomes' ? rcpScenarios.slice(0, 3) : rcpScenarios;
  const filteredEarthModels = selectedDiversity === 'Biomes' ? earthModels.slice(0, 1) : earthModels;
  const filteredPlanktonGroups = selectedDiversity === 'Biomes' ? planktonGroups.slice(0, 1) : planktonGroups;

  const filteredRcpScenariosPanel1 =
    panel1Diversity === 'Biomes' ? rcpScenarios.slice(0, 3) : rcpScenarios;
  const filteredModelsPanel1 = panel1Diversity === 'Biomes' ? earthModels.slice(0, 1) : earthModels;
  const filteredGroupsPanel1 = panel1Diversity === 'Biomes' ? planktonGroups.slice(0, 1) : planktonGroups;

  const filteredRcpScenariosPanel2 =
    panel2Diversity === 'Biomes' ? rcpScenarios.slice(0, 3) : rcpScenarios;
  const filteredModelsPanel2 = panel2Diversity === 'Biomes' ? earthModels.slice(0, 1) : earthModels;
  const filteredGroupsPanel2 = panel2Diversity === 'Biomes' ? planktonGroups.slice(0, 1) : planktonGroups;

  // ── Styles for the three‐column flex layout ──
  const LABEL_COLUMN = {
    width: '100px',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  };
  const INPUT_COLUMN = {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  };
  const ICON_COLUMN = {
    width: '62px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  };

  return (
    <Box className="App" sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: 0, gap: 1 }}>
      {/* ── HEADER: White panel matching Footer style ── */}
      <Box
        component="header"
        sx={{
          backgroundColor: '#ffffff', // White panel
          py: 2,
          px: 4,
          position: 'relative',
          textAlign: 'center', gap: 1
        }}
      >
        {/* Centered: “MAPMAKER” in larger font */}
        <Typography
          variant="h1"
          component="h1"
          sx={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'black' }}
        >
          MAPMAKER
        </Typography>

        {/* References button at upper‐right */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: 16,
            transform: 'translateY(-50%)', gap: 1
          }}
        >
          <Button
            onClick={openRefsModal}
            sx={{
              color: 'black',
              textTransform: 'none',
              p: 0,
              fontSize: 14,
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            References &amp; Data Courtesy
          </Button>
        </Box>
      </Box>

      {/* ── INFORMATION MODAL (“Explanation”) ── */}
      <Dialog open={infoModalOpen} onClose={closeInfoModal} maxWidth="sm" fullWidth>
        <DialogTitle>Explanation</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {infoModalText}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeInfoModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── REFERENCES & DATA COURTESY MODAL ── */}
      <Dialog open={refsModalOpen} onClose={closeRefsModal} maxWidth="md" fullWidth>
        <DialogTitle>References &amp; Data Courtesy</DialogTitle>
        <DialogContent dividers>
          {/* Data Section */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
            Data
          </Typography>

          {/* Phytoplankton */}
          <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
            Phytoplankton
          </Typography>
          <Typography variant="body2" paragraph>
            Damiano Righetti et al. PhytoBase: A global synthesis of open-ocean phytoplankton occurrences,
            In: <em>Earth System Science Data</em> (2020), pp. 907–933, doi:{' '}
            <Link
              href="https://doi.org/10.5194/essd-12-907-2020"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'primary.main' }}
            >
              10.5194/essd-12-907-2020
            </Link>
            , url:{' '}
            <Link
              href="https://essd.copernicus.org/articles/12/907/2020/"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'primary.main' }}
            >
              https://essd.copernicus.org/articles/12/907/2020/
            </Link>
          </Typography>

          {/* Zooplankton */}
          <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
            Zooplankton
          </Typography>
          <Typography variant="body2" paragraph>
            Benedetti et al. Major restructuring of marine plankton assemblages under global warming (under review)
            <br />
            E. T. Buitenhuis et al. MAREDAT: towards a world atlas of MARine Ecosystem DATa,
            In: <em>Earth System Science Data</em> (July 2013), pp. 227–239, doi:{' '}
            <Link
              href="https://doi.org/10.5194/essd-5-227-2013"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'primary.main' }}
            >
              10.5194/essd-5-227-2013
            </Link>
          </Typography>

          {/* Species Distribution Models */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
            Species Distribution Models
          </Typography>
          <Typography variant="body2" paragraph sx={{ mt: 1 }}>
            Damiano Righetti et al. Global pattern of phytoplankton diversity driven by temperature and environmental variability, In: <em>Science Advances</em> (2019), doi:{' '}
            <Link
              href="https://doi.org/10.1126/sciadv.aau6253"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'primary.main' }}
            >
              10.1126/sciadv.aau6253
            </Link>
            , eprint:{' '}
            <Link
              href="https://advances.sciencemag.org/content/5/5/eaau6253.full.pdf"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'primary.main' }}
            >
              Full PDF
            </Link>
            , url:{' '}
            <Link
              href="https://advances.sciencemag.org/content/5/5/eaau6253"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'primary.main' }}
            >
              Article Link
            </Link>
          </Typography>
          <Typography variant="body2" paragraph>
            Benedetti et al. Major restructuring of marine plankton assemblages under global warming (under review)
            <br />
            Urs Hofmann Elizondo et al. Biome partitioning of the global ocean based on phytoplankton biogeography, In: <em>Progress in Oceanography</em> (2021), p. 102530. issn: 0079–6611, doi:{' '}
            <Link
              href="https://doi.org/10.1016/j.pocean.2021.102530"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'primary.main' }}
            >
              10.1016/j.pocean.2021.102530
            </Link>
            , url:{' '}
            <Link
              href="https://www.sciencedirect.com/science/article/pii/S0079661121000203"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'primary.main' }}
            >
              Full Article
            </Link>
          </Typography>

          {/* CMIP5 */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
            CMIP5
          </Typography>
          <Typography variant="body2" paragraph sx={{ mt: 1 }}>
            Karl E. Taylor, Ronald J. Stouffer, and Gerald A. Meehl. An Overview of CMIP5 and the Experiment Design, In: <em>Bulletin of the American Meteorological Society</em> (2012), pp. 485–498, doi:{' '}
            <Link
              href="https://doi.org/10.1175/BAMS-D-11-00094.1"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'primary.main' }}
            >
              10.1175/BAMS-D-11-00094.1
            </Link>
            , url:{' '}
            <Link
              href="https://journals.ametsoc.org/view/journals/bams/93/4/bams-d-11-00094.1.xml"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'primary.main' }}
            >
              Full Article
            </Link>
          </Typography>

          {/* Earth System Models */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
            Earth System Models
          </Typography>
          <Typography variant="body2" paragraph sx={{ mt: 1 }}>
            Aurore Voldoire et al. The CNRM-CM5.1 global climate model: description and basic evaluation, In: <em>Climate Dynamics</em> (May 2013), pp. 2091–2121, doi:{' '}
            <Link
              href="https://doi.org/10.1007/S00382-011-1259-Y"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'primary.main' }}
            >
              10.1007/S00382-011-1259-Y
            </Link>
            , url:{' '}
            <Link
              href="https://hal.archives-ouvertes.fr/hal-008330"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'primary.main' }}
            >
              Full Article
            </Link>
          </Typography>
          <Typography variant="body2" paragraph>
            Jean-Louis Dufresne et al. Climate change projections using the IPSL-CM5 Earth System Model: from CMIP3 to CMIP5, In: <em>Climate Dynamics</em> (2013), pp. 2123–2165, doi:{' '}
            <Link
              href="https://doi.org/10.1007/S00382-012-1636-1"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'primary.main' }}
            >
              10.1007/S00382-012-1636-1
            </Link>
            , url:{' '}
            <Link
              href="https://hal.archives-ouvertes.fr/hal-0079"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'primary.main' }}
            >
              Full Article
            </Link>
          </Typography>
          <Typography variant="body2" paragraph>
            Thomas L. Delworth et al. GFDL’s CM2 Global Coupled Climate Models. Part I: Formulation and Simulation Characteristics, In: <em>Journal of Climate</em> (2006), pp. 643–674, doi:{' '}
            <Link
              href="https://doi.org/10.1175/JCLI3629.1"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'primary.main' }}
            >
              10.1175/JCLI3629.1
            </Link>
            , url:{' '}
            <Link
              href="https://journals.ametsoc.org/view/journals/clim/19/5/jcli3629"
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'primary.main' }}
            >
              Full Article
            </Link>
          </Typography>

          {/* Acknowledgements */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
            Acknowledgements
          </Typography>
          <Typography variant="body2" paragraph sx={{ mt: 1 }}>
            We acknowledge the World Climate Research Programme’s Working Group on Coupled Modelling, which is responsible for CMIP, and we thank the climate modeling groups for producing and making available their model output. For CMIP the U.S. Department of Energy’s Program for Climate Model Diagnosis and Intercomparison provides coordinating support and led development of software infrastructure in partnership with the Global Organization for Earth System Science Portals.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRefsModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── DUAL DATA PANELS ── */}
      <Box
        className="dual-display"
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          p: 2,
        }}
      >
        {/* ── PANEL 1 ── */}
        <Box
          className="display-panel"
          sx={{
            flex: 1,
            minWidth: 300,
            p: 2,
            backgroundColor: 'black',
            borderRadius: 1,
          }}
        >
          {/* ── CONTROLS (PANEL 1) ── */}
          <Box
            className="panel-controls"
            sx={{
              mb: 1,
              minHeight: 300, // Fixes control area height so both panels line up
            }}
          >
            {/* ── DATA-SOURCE ROW ── */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
              <FormControl component="fieldset" sx={{ color: 'white' }}>
                <RadioGroup
                  row
                  name="source1"
                  value={panel1Source}
                  onChange={(e) => setPanel1Source(e.target.value)}
                >
                  <FormControlLabel
                    value="plankton"
                    control={<Radio />}
                    label={<Typography color="white">Plankton</Typography>}
                  />
                  <FormControlLabel
                    value="environmental"
                    control={<Radio />}
                    label={<Typography color="white">Environmental</Typography>}
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            {/* ── VIEW ROW (Panel 1) ── */}

            {/* ── Row 1: Index or Metric ── */}
            <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
              {/* Label + general info icon */}
              <Box sx={LABEL_COLUMN}>
                {panel1Source === 'plankton' ? (
                  <>
                                        <IconButton
                      onClick={() => openInfoModal('Diversity Indices general')}
                      size="small"
                      sx={{ color: 'white', p: 0 }}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                    <Typography color="white" sx={{ mr: 0.5 }}>
                       Index:
                    </Typography>

                  </>
                ) : (
                  <Typography color="white">Metric:</Typography>
                )}
              </Box>

              {/* Select input (with minWidth so placeholder never wraps) */}
              <Box sx={INPUT_COLUMN}>
                {panel1Source === 'plankton' ? (
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >

                    <Select
                      labelId="diversity1-label"
                      id="diversity1"
                      value={panel1Diversity}
                      onChange={(e) => setPanel1Diversity(e.target.value)}
                      label="Select Index"
                    >
                      {diversityIndices.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >

                    <Select
                      labelId="env1-label"
                      id="env1"
                      value={panel1EnvParam}
                      onChange={(e) => setPanel1EnvParam(e.target.value)}
                      label="Select Metric"
                    >
                      {environmentalParameters.map((param) => (
                        <MenuItem key={param} value={param}>
                          {param}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>

              {/* “Specific” info icon */}
              <Box sx={ICON_COLUMN}>
                {panel1Source === 'plankton' ? (
                  <IconButton
                    onClick={() => openInfoModal(panel1Diversity)}
                    size="small"
                    sx={{ color: 'white', p: 0 }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                ) : null}
              </Box>
            </Box>

            {/* ── Row 2: Group (only if plankton) ── */}
            {panel1Source === 'plankton' && (
              <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
                {/* Label + general info icon */}
                <Box sx={LABEL_COLUMN}>
                                    <IconButton
                    onClick={() => openInfoModal('Plankton Groups general')}
                    size="small"
                    sx={{ color: 'white', p: 0 }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                  <Typography color="white" sx={{ mr: 0.5 }}>
                    Group:
                  </Typography>

                </Box>

                {/* Select input */}
                <Box sx={INPUT_COLUMN}>
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >

                    <Select
                      labelId="group1-label"
                      id="group1"
                      value={panel1Group}
                      onChange={(e) => setPanel1Group(e.target.value)}
                      label="Select Group"
                    >
                      {filteredGroupsPanel1.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* “Specific” info icon */}
                <Box sx={ICON_COLUMN}>
                  <IconButton
                    onClick={() => openInfoModal(panel1Group)}
                    size="small"
                    sx={{ color: 'white', p: 0 }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}

            {/* ── Row 3: Scenario (only if plankton) ── */}
            {panel1Source === 'plankton' && (
              <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
                {/* Label + general info icon */}
                <Box sx={LABEL_COLUMN}>
                                    <IconButton
                    onClick={() => openInfoModal('RCP Scenarios general')}
                    size="small"
                    sx={{ color: 'white', p: 0 }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                  <Typography color="white" sx={{ mr: 0.5 }}>
                    Scenario:
                  </Typography>

                </Box>

                {/* Select input */}
                <Box sx={INPUT_COLUMN}>
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >

                    <Select
                      labelId="rcp1-label"
                      id="rcp1"
                      value={panel1RCP}
                      onChange={(e) => setPanel1RCP(e.target.value)}
                      label="Select Scenario"
                    >
                      {filteredRcpScenariosPanel1.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* “Specific” info icon */}
                <Box sx={ICON_COLUMN}>
                  <IconButton
                    onClick={() => openInfoModal(panel1RCP)}
                    size="small"
                    sx={{ color: 'white', p: 0 }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}

            {/* ── Row 4: Model (only if plankton) ── */}
            {panel1Source === 'plankton' && (
              <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
                {/* Label + general info icon */}
                <Box sx={LABEL_COLUMN}>
                                    <IconButton
                    onClick={() => openInfoModal('Earth System Models general')}
                    size="small"
                    sx={{ color: 'white', p: 0,  }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                  <Typography color="white" sx={{ mr: 0.5 }}>
                    Model:
                  </Typography>

                </Box>

                {/* Select input */}
                <Box sx={INPUT_COLUMN}>
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >

                    <Select
                      labelId="model1-label"
                      id="model1"
                      value={panel1Model}
                      onChange={(e) => setPanel1Model(e.target.value)}
                      label="Select Model"
                    >
                      {filteredModelsPanel1.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* “Specific” info icon */}
                <Box sx={ICON_COLUMN}>
                  <IconButton
                    onClick={() => openInfoModal(panel1Model)}
                    size="small"
                    sx={{ color: 'white', p: 0 }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>
          {/* ── END CONTROLS (PANEL 1) ── */}

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'flex-end' }}>
              <FormControl component="fieldset" sx={{ color: 'white' }}>
                <RadioGroup
                  row
                  name="view1"
                  value={panel1View}
                  onChange={(e) => setPanel1View(e.target.value)}
                >
                  <FormControlLabel
                    value="map"
                    control={<Radio />}
                    label={<Typography color="white">Map</Typography>}
                  />
                  <FormControlLabel
                    value="globe"
                    control={<Radio />}
                    label={<Typography color="white">Globe</Typography>}
                  />
                </RadioGroup>
              </FormControl>
            </Box>


          {/* ── Year Slider (Panel 1) ── */}
          <Box sx={{ mb: 2, px: 1 }}>
            <MuiSlider
              min={2012}
              max={2100}
              value={panel1Year}
              onChange={(event, value) => {
                setPanel1Year(value);
                debouncedUpdatePanel1(value);
              }}
              valueLabelDisplay="auto"
              sx={{
                color: '#1976d2',
              }}
            />
          </Box>

          {/* Render Panel 1 content (fixed 400px height) */}
          <Box
            sx={{
              width: '100%',
              height: 400,
              position: 'relative',
            }}
          >
            {panel1Source === 'plankton' && panel1View === 'map' && (
              <MapDisplay
                year={panel1Year}
                index={panel1Diversity}
                group={panel1Group}
                scenario={panel1RCP}
                model={panel1Model}
                sourceType="plankton"
                onPointClick={handlePointClick}
              />
            )}
            {panel1Source === 'plankton' && panel1View === 'globe' && (
              <GlobeDisplay
                year={panel1DebouncedYear}
                index={panel1Diversity}
                group={panel1Group}
                scenario={panel1RCP}
                model={panel1Model}
                sourceType="plankton"
                onPointClick={handlePointClick}
              />
            )}
            {panel1Source === 'environmental' && panel1View === 'map' && (
              <MapDisplay
                year={panel1Year}
                index={panel1EnvParam}
                scenario={panel1RCP}
                model={panel1Model}
                sourceType="environmental"
                onPointClick={handlePointClick}
              />
            )}
            {panel1Source === 'environmental' && panel1View === 'globe' && (
              <GlobeDisplay
                year={panel1DebouncedYear}
                index={panel1EnvParam}
                scenario={panel1RCP}
                model={panel1Model}
                sourceType="environmental"
                onPointClick={handlePointClick}
              />
            )}
          </Box>
        </Box>

        {/* ── PANEL 2 ── */}
        <Box
          className="display-panel"
          sx={{
            flex: 1,
            minWidth: 300,
            p: 2,
            backgroundColor: 'black',
            borderRadius: 1,
          }}
        >
          {/* ── CONTROLS (PANEL 2) ── */}
          <Box
            className="panel-controls"
            sx={{
              mb: 2,
              minHeight: 300, // Same fixed height as Panel 1 controls
            }}
          >
            {/* ── DATA-SOURCE ROW ── */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between'}}>
              <FormControl component="fieldset" sx={{ color: 'white' }}>
                <RadioGroup
                  row
                  name="source2"
                  value={panel2Source}
                  onChange={(e) => setPanel2Source(e.target.value)}
                >
                  <FormControlLabel
                    value="plankton"
                    control={<Radio />}
                    label={<Typography color="white">Plankton</Typography>}
                  />
                  <FormControlLabel
                    value="environmental"
                    control={<Radio />}
                    label={<Typography color="white">Environmental</Typography>}
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            {/* ── VIEW ROW (Panel 2) ── */}


            {/* ── Row 1: Index or Metric ── */}
            <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
              {/* Label + general info icon */}
              <Box sx={LABEL_COLUMN}>
                {panel2Source === 'plankton' ? (
                  <>
                                        <IconButton
                      onClick={() => openInfoModal('Diversity Indices general')}
                      size="small"
                      sx={{ color: 'white', p: 0 }}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                    <Typography color="white" sx={{ mr: 0.5 }}>
                      Index:
                    </Typography>

                  </>
                ) : (
                  <Typography color="white">Metric:</Typography>
                )}
              </Box>

              {/* Select input */}
              <Box sx={INPUT_COLUMN}>
                {panel2Source === 'plankton' ? (
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >

                    <Select
                      labelId="diversity2-label"
                      id="diversity2"
                      value={panel2Diversity}
                      onChange={(e) => setPanel2Diversity(e.target.value)}
                      label="Select Index"
                    >
                      {diversityIndices.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >

                    <Select
                      labelId="env2-label"
                      id="env2"
                      value={panel2EnvParam}
                      onChange={(e) => setPanel2EnvParam(e.target.value)}
                      label="Select Metric"
                    >
                      {environmentalParameters.map((param) => (
                        <MenuItem key={param} value={param}>
                          {param}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>

              {/* “Specific” info icon */}
              <Box sx={ICON_COLUMN}>
                {panel2Source === 'plankton' ? (
                  <IconButton
                    onClick={() => openInfoModal(panel2Diversity)}
                    size="small"
                    sx={{ color: 'white', p: 0 }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                ) : null}
              </Box>
            </Box>

            {/* ── Row 2: Group (only if plankton) ── */}
            {panel2Source === 'plankton' && (
              <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
                {/* Label + general info icon */}
                <Box sx={LABEL_COLUMN}>
                                    <IconButton
                    onClick={() => openInfoModal('Plankton Groups general')}
                    size="small"
                    sx={{ color: 'white', p: 0 }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                  <Typography color="white" sx={{ mr: 0.5 }}>
                    Group:
                  </Typography>

                </Box>

                {/* Select input */}
                <Box sx={INPUT_COLUMN}>
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >

                    <Select
                      labelId="group2-label"
                      id="group2"
                      value={panel2Group}
                      onChange={(e) => setPanel2Group(e.target.value)}
                      label="Select Group"
                    >
                      {filteredGroupsPanel2.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* “Specific” info icon */}
                <Box sx={ICON_COLUMN}>
                  <IconButton
                    onClick={() => openInfoModal(panel2Group)}
                    size="small"
                    sx={{ color: 'white', p: 0 }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}

            {/* ── Row 3: Scenario (only if plankton) ── */}
            {panel2Source === 'plankton' && (
              <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
                {/* Label + general info icon */}
                <Box sx={LABEL_COLUMN}>
                                    <IconButton
                    onClick={() => openInfoModal('RCP Scenarios general')}
                    size="small"
                    sx={{ color: 'white', p: 0 }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                  <Typography color="white" sx={{ mr: 0.5 }}>
                    Scenario:
                  </Typography>

                </Box>

                {/* Select input */}
                <Box sx={INPUT_COLUMN}>
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >

                    <Select
                      labelId="rcp2-label"
                      id="rcp2"
                      value={panel2RCP}
                      onChange={(e) => setPanel2RCP(e.target.value)}
                      label="Select Scenario"
                    >
                      {filteredRcpScenariosPanel2.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* “Specific” info icon */}
                <Box sx={ICON_COLUMN}>
                  <IconButton
                    onClick={() => openInfoModal(panel2RCP)}
                    size="small"
                    sx={{ color: 'white', p: 0 }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}

            {/* ── Row 4: Model (only if plankton) ── */}
            {panel2Source === 'plankton' && (
              <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
                {/* Label + general info icon */}
                <Box sx={LABEL_COLUMN}>
                                    <IconButton
                    onClick={() => openInfoModal('Earth System Models general')}
                    size="small"
                    sx={{ color: 'white', p: 0,  }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                  <Typography color="white" sx={{ mr: 0.5 }}>
                    Model:
                  </Typography>

                </Box>

                {/* Select input */}
                <Box sx={INPUT_COLUMN}>
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >

                    <Select
                      labelId="model2-label"
                      id="model2"
                      value={panel2Model}
                      onChange={(e) => setPanel2Model(e.target.value)}
                      label="Select Model"
                    >
                      {filteredModelsPanel2.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* “Specific” info icon */}
                <Box sx={ICON_COLUMN}>
                  <IconButton
                    onClick={() => openInfoModal(panel2Model)}
                    size="small"
                    sx={{ color: 'white', p: 0 }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>
          {/* ── END CONTROLS (PANEL 2) ── */}

           <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'flex-end' }}>
              <FormControl component="fieldset" sx={{ color: 'white' }}>
                <RadioGroup
                  row
                  name="view2"
                  value={panel2View}
                  onChange={(e) => setPanel2View(e.target.value)}
                >
                  <FormControlLabel
                    value="map"
                    control={<Radio />}
                    label={<Typography color="white">Map</Typography>}
                  />
                  <FormControlLabel
                    value="globe"
                    control={<Radio />}
                    label={<Typography color="white">Globe</Typography>}
                  />
                </RadioGroup>
              </FormControl>
            </Box>

          {/* ── Year Slider (Panel 2) ── */}
          <Box sx={{ mb: 2, px: 1 }}>
            <MuiSlider
              min={2012}
              max={2100}
              value={panel2Year}
              onChange={(event, value) => {
                setPanel2Year(value);
                debouncedUpdatePanel2(value);
              }}
              valueLabelDisplay="auto"
              sx={{
                color: '#1976d2',
              }}
            />
          </Box>

          {/* Render Panel 2 content (fixed 400px height) */}
          <Box
            sx={{
              width: '100%',
              height: 400,
              position: 'relative',
            }}
          >
            {panel2Source === 'plankton' && panel2View === 'map' && (
              <MapDisplay
                year={panel2Year}
                index={panel2Diversity}
                group={panel2Group}
                scenario={panel2RCP}
                model={panel2Model}
                sourceType="plankton"
                onPointClick={handlePointClick}
              />
            )}
            {panel2Source === 'plankton' && panel2View === 'globe' && (
              <GlobeDisplay
                year={panel2DebouncedYear}
                index={panel2Diversity}
                group={panel2Group}
                scenario={panel2RCP}
                model={panel2Model}
                sourceType="plankton"
                onPointClick={handlePointClick}
              />
            )}
            {panel2Source === 'environmental' && panel2View === 'map' && (
              <MapDisplay
                year={panel2Year}
                index={panel2EnvParam}
                scenario={panel2RCP}
                model={panel2Model}
                sourceType="environmental"
                onPointClick={handlePointClick}
              />
            )}
            {panel2Source === 'environmental' && panel2View === 'globe' && (
              <GlobeDisplay
                year={panel2DebouncedYear}
                index={panel2EnvParam}
                scenario={panel2RCP}
                model={panel2Model}
                sourceType="environmental"
                onPointClick={handlePointClick}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* ── COMBINED LINE CHART ── */}
      <Box
        className="combined-lineplot"
        sx={{
          width: '100%',
          mt: 3,
          p: 2,
          backgroundColor: '#1e1e1e',
          borderRadius: 1,
        }}
      >
        <CombinedLinePlot
          point={selectedPoint}
          leftSettings={{
            source: panel1Source,
            index: panel1Diversity,
            group: panel1Group,
            envParam: panel1EnvParam,
            scenario: panel1RCP,
            model: panel1Model,
          }}
          rightSettings={{
            source: panel2Source,
            index: panel2Diversity,
            group: panel2Group,
            envParam: panel2EnvParam,
            scenario: panel2RCP,
            model: panel2Model,
          }}
          startYear={2012}
          endYear={endYear}
        />
      </Box>

      {/* ── FOOTER (logos) ── */}
      <Box sx={{ mt: 2 }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default App;
