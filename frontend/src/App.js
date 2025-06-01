import React, { useState, useMemo } from 'react';
import GlobeDisplay       from './components/GlobeDisplay';
import MapDisplay         from './components/MapDisplay';
import CombinedLinePlot   from './components/CombinedLinePlot';
import Footer             from './components/Footer';
import ReferencesButton   from './components/ReferencesButton';
import _                  from 'lodash';
import './App.css';

/* -------------------------------  MUI v6  ------------------------------- */
import {
  Box,
  Typography,
  FormControl,
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
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

/* -------------------------  STATIC SELECT OPTIONS  ---------------------- */
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

/* ----------------------------  HELP MESSAGES  --------------------------- */
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
  Diatoms:
    'Diatoms are a group of microalgae that are known for their unique silica-based cell walls.',
  Dinoflagellates:
    'Dinoflagellates are a type of plankton responsible for phenomena like red tides and bioluminescence.',
  Coccolithophores:
    'Coccolithophores are single-celled marine algae surrounded by a microscopic plating made of calcium carbonate.',
};

const rcpMessages = {
  'RCP 2.6 (Paris Agreement)':
    'RCP 2.6 assumes global annual greenhouse-gas emissions peak between 2010–2020 and decline substantially thereafter.',
  'RCP 4.5':
    'RCP 4.5 is an intermediate scenario where emissions peak around 2040, then decline.',
  'RCP 8.5 (Business as Usual)':
    'RCP 8.5 is a high-emission scenario often considered the “business-as-usual” pathway.',
  'RCP 8.5 - RCP2.6':
    'Difference between RCP 8.5 and RCP 2.6; highlights the contrast between high-emission and stringent mitigation pathways.',
  'RCP 8.5 - RCP 4.5':
    'Difference between RCP 8.5 and RCP 4.5; shows the impact of extreme versus intermediate emission trajectories.',
  'RCP 4.5 - RCP 2.6':
    'Difference between RCP 4.5 and RCP 2.6; illustrates the benefits of intermediate versus stringent mitigation scenarios.',
};

const modelMessages = {
  'Model Mean':
    'The model mean represents the average outcome across multiple climate models, providing a consensus projection.',
  'CNRM-CM5':
    'CNRM-CM5 is a global climate model developed by Météo-France in collaboration with other research institutions.',
  'GFDL-ESM2M':
    'GFDL-ESM2M is a coupled climate model developed by NOAA’s Geophysical Fluid Dynamics Laboratory.',
  'IPSL-CMSA-LR':
    'IPSL-CMSA-LR is a climate model developed by the Institut Pierre-Simon Laplace, used for climate projections.',
};

/* ========================================================================
 *                                APP
 * ===================================================================== */
const App = () => {
  /* ------------------------------  STATE  ------------------------------ */
  const [selectedDiversity, setSelectedDiversity] = useState(diversityIndices[1]);
  const [selectedPlankton,  setSelectedPlankton ] = useState(planktonGroups[0]);
  const [selectedRCP,       setSelectedRCP      ] = useState(rcpScenarios[0]);
  const [selectedModel,     setSelectedModel    ] = useState(earthModels[0]);
  const [selectedEnvParam,  setSelectedEnvParam ] = useState(environmentalParameters[0]);

  /* ----------  Panel-specific state (mirrored structure)  ---------- */
  const [panel1Year,  setPanel1Year ] = useState(2012);
  const [panel1DebouncedYear, setPanel1DebouncedYear] = useState(2012);
  const [panel1Source, setPanel1Source] = useState('plankton');   // “plankton” | “environmental”
  const [panel1View,   setPanel1View  ] = useState('map');        // “map” | “globe”
  const [panel1EnvParam,  setPanel1EnvParam ] = useState(environmentalParameters[0]);
  const [panel1Diversity, setPanel1Diversity] = useState(selectedDiversity);
  const [panel1Group,     setPanel1Group    ] = useState(selectedPlankton);
  const [panel1RCP,       setPanel1RCP      ] = useState(selectedRCP);
  const [panel1Model,     setPanel1Model    ] = useState(selectedModel);

  const [panel2Year,  setPanel2Year ] = useState(2012);
  const [panel2DebouncedYear, setPanel2DebouncedYear] = useState(2012);
  const [panel2Source, setPanel2Source] = useState('environmental');
  const [panel2View,   setPanel2View  ] = useState('globe');
  const [panel2EnvParam,  setPanel2EnvParam ] = useState(environmentalParameters[0]);
  const [panel2Diversity, setPanel2Diversity] = useState(selectedDiversity);
  const [panel2Group,     setPanel2Group    ] = useState(selectedPlankton);
  const [panel2RCP,       setPanel2RCP      ] = useState(selectedRCP);
  const [panel2Model,     setPanel2Model    ] = useState(selectedModel);

  /* ---------------------------  Info modal  --------------------------- */
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalText, setInfoModalText] = useState('');

  /* -------------  Combined-chart clicked coordinate  -------------- */
  const [selectedPoint, setSelectedPoint] = useState({ x: null, y: null });
  const endYear = 2100;

  /* --------------------------  Debounce year  ------------------------ */
  const debouncedUpdatePanel1 = useMemo(
    () => _.debounce((y) => setPanel1DebouncedYear(y), 500),
    []
  );
  const debouncedUpdatePanel2 = useMemo(
    () => _.debounce((y) => setPanel2DebouncedYear(y), 500),
    []
  );

  /* ----------------------------  Helpers  --------------------------- */
  const handlePointClick = (x, y) => setSelectedPoint({ x, y });

  const openInfoModal = (category) => {
    let text = '';
    if (category.endsWith(' general')) {
      const key = category.replace(/ general$/, '');
      switch (key) {
        case 'Diversity Indices':
          text =
            'Different diversity indices based on the Habitat Suitability Index.';
          break;
        case 'Plankton Groups':
          text =
            'Marine taxonomic groupings important for global ecosystem services provided by our oceans.';
          break;
        case 'RCP Scenarios':
          text =
            'Representative Concentration Pathways describe greenhouse-gas trajectories and radiative forcing scenarios.';
          break;
        case 'Earth System Models':
          text =
            'Earth System Models are coupled climate-biogeochemical models used for projecting environmental changes.';
          break;
        default:
          text = 'No information available';
      }
    } else {
      text =
        diversityMessages[category] ??
        planktonMessages[category] ??
        rcpMessages[category] ??
        modelMessages[category] ??
        'No information available';
    }
    setInfoModalText(text);
    setInfoModalOpen(true);
  };
  const closeInfoModal = () => setInfoModalOpen(false);

  /* -----------------------  Dynamic option subsets  ------------------ */
  const filteredRcpScenarios   = selectedDiversity === 'Biomes' ? rcpScenarios.slice(0, 3) : rcpScenarios;
  const filteredEarthModels    = selectedDiversity === 'Biomes' ? earthModels.slice(0, 1)  : earthModels;
  const filteredPlanktonGroups = selectedDiversity === 'Biomes' ? planktonGroups.slice(0,1): planktonGroups;

  const filteredRcpScenariosP1 = panel1Diversity === 'Biomes' ? rcpScenarios.slice(0, 3) : rcpScenarios;
  const filteredModelsP1       = panel1Diversity === 'Biomes' ? earthModels.slice(0, 1)  : earthModels;
  const filteredGroupsP1       = panel1Diversity === 'Biomes' ? planktonGroups.slice(0,1): planktonGroups;

  const filteredRcpScenariosP2 = panel2Diversity === 'Biomes' ? rcpScenarios.slice(0, 3) : rcpScenarios;
  const filteredModelsP2       = panel2Diversity === 'Biomes' ? earthModels.slice(0, 1)  : earthModels;
  const filteredGroupsP2       = panel2Diversity === 'Biomes' ? planktonGroups.slice(0,1): planktonGroups;

  /* ----------------------------  Layout  ----------------------------- */
  const LABEL_COLUMN = { width: '100px', display: 'flex', alignItems: 'center', gap: 1 };
  const INPUT_COLUMN = { flexGrow: 1, display: 'flex', alignItems: 'center' };
  const ICON_COLUMN  = { width: '62px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' };

  /* ====================================================================
   *                               RENDER
   * ================================================================== */
  return (
    <Box className="App" sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: 0, gap: 1 }}>
      {/* =================================================================
       *                            HEADER
       * =============================================================== */}
      <Box
        component="header"
        sx={{
          backgroundColor: '#ffffff',
          py: 2,
          px: 4,
          position: 'relative',
          textAlign: 'center',
          gap: 1,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'black' }}
        >
          MAPMAKER
        </Typography>

        {/* New reference button (opens modal handled internally) */}
        <ReferencesButton
          sx={{ position: 'absolute', top: '50%', right: 16, transform: 'translateY(-50%)' }}
        />
      </Box>

      {/* ---------------------------  INFO MODAL  ------------------------ */}
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

      {/* ================================================================
       *                       DUAL DISPLAY PANELS
       * ============================================================== */}
      <Box className="dual-display" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', p: 2 }}>
        {/* ==========================  PANEL 1  ========================== */}
        <Box
          className="display-panel"
          sx={{ flex: 1, minWidth: 300, p: 2, backgroundColor: 'black', borderRadius: 1 }}
        >
          {/* ------------------  CONTROLS (PANEL 1)  ------------------ */}
          <Box className="panel-controls" sx={{ mb: 1, minHeight: 300 }}>
            {/* DATA-SOURCE ROW */}
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

            {/* INDEX / METRIC ROW */}
            <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
              {/* Label + generic info */}
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

              {/* Select */}
              <Box sx={INPUT_COLUMN}>
                {panel1Source === 'plankton' ? (
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >
                    <Select
                      id="diversity1"
                      value={panel1Diversity}
                      onChange={(e) => setPanel1Diversity(e.target.value)}
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
                      id="env1"
                      value={panel1EnvParam}
                      onChange={(e) => setPanel1EnvParam(e.target.value)}
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

              {/* Specific info icon */}
              <Box sx={ICON_COLUMN}>
                {panel1Source === 'plankton' && (
                  <IconButton
                    onClick={() => openInfoModal(panel1Diversity)}
                    size="small"
                    sx={{ color: 'white', p: 0 }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>

            {/* GROUP ROW (plankton only) */}
            {panel1Source === 'plankton' && (
              <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
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

                <Box sx={INPUT_COLUMN}>
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >
                    <Select
                      id="group1"
                      value={panel1Group}
                      onChange={(e) => setPanel1Group(e.target.value)}
                    >
                      {filteredGroupsP1.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

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

            {/* SCENARIO ROW (plankton only) */}
            {panel1Source === 'plankton' && (
              <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
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

                <Box sx={INPUT_COLUMN}>
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >
                    <Select
                      id="rcp1"
                      value={panel1RCP}
                      onChange={(e) => setPanel1RCP(e.target.value)}
                    >
                      {filteredRcpScenariosP1.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

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

            {/* MODEL ROW (plankton only) */}
            {panel1Source === 'plankton' && (
              <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
                <Box sx={LABEL_COLUMN}>
                  <IconButton
                    onClick={() => openInfoModal('Earth System Models general')}
                    size="small"
                    sx={{ color: 'white', p: 0 }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                  <Typography color="white" sx={{ mr: 0.5 }}>
                    Model:
                  </Typography>
                </Box>

                <Box sx={INPUT_COLUMN}>
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >
                    <Select
                      id="model1"
                      value={panel1Model}
                      onChange={(e) => setPanel1Model(e.target.value)}
                    >
                      {filteredModelsP1.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

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
          {/* ----------  END CONTROLS (PANEL 1)  ---------- */}

          {/* VIEW SWITCH */}
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

          {/* YEAR SLIDER */}
          <Box sx={{ mb: 2, px: 1 }}>
            <MuiSlider
              min={2012}
              max={2100}
              value={panel1Year}
              onChange={(e, val) => {
                setPanel1Year(val);
                debouncedUpdatePanel1(val);
              }}
              valueLabelDisplay="auto"
              sx={{ color: '#1976d2' }}
            />
          </Box>

          {/* PANEL 1 DISPLAY */}
          <Box sx={{ width: '100%', height: 400, position: 'relative' }}>
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

        {/* ==========================  PANEL 2  ========================== */}
        <Box
          className="display-panel"
          sx={{ flex: 1, minWidth: 300, p: 2, backgroundColor: 'black', borderRadius: 1 }}
        >
          {/* ------------------  CONTROLS (PANEL 2)  ------------------ */}
          <Box className="panel-controls" sx={{ mb: 2, minHeight: 300 }}>
            {/* DATA-SOURCE ROW */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
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

            {/* INDEX / METRIC ROW */}
            <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
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

              <Box sx={INPUT_COLUMN}>
                {panel2Source === 'plankton' ? (
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >
                    <Select
                      id="diversity2"
                      value={panel2Diversity}
                      onChange={(e) => setPanel2Diversity(e.target.value)}
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
                      id="env2"
                      value={panel2EnvParam}
                      onChange={(e) => setPanel2EnvParam(e.target.value)}
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

              <Box sx={ICON_COLUMN}>
                {panel2Source === 'plankton' && (
                  <IconButton
                    onClick={() => openInfoModal(panel2Diversity)}
                    size="small"
                    sx={{ color: 'white', p: 0 }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Box>

            {/* GROUP ROW */}
            {panel2Source === 'plankton' && (
              <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
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

                <Box sx={INPUT_COLUMN}>
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >
                    <Select
                      id="group2"
                      value={panel2Group}
                      onChange={(e) => setPanel2Group(e.target.value)}
                    >
                      {filteredGroupsP2.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

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

            {/* SCENARIO ROW */}
            {panel2Source === 'plankton' && (
              <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
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

                <Box sx={INPUT_COLUMN}>
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >
                    <Select
                      id="rcp2"
                      value={panel2RCP}
                      onChange={(e) => setPanel2RCP(e.target.value)}
                    >
                      {filteredRcpScenariosP2.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

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

            {/* MODEL ROW */}
            {panel2Source === 'plankton' && (
              <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
                <Box sx={LABEL_COLUMN}>
                  <IconButton
                    onClick={() => openInfoModal('Earth System Models general')}
                    size="small"
                    sx={{ color: 'white', p: 0 }}
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                  <Typography color="white" sx={{ mr: 0.5 }}>
                    Model:
                  </Typography>
                </Box>

                <Box sx={INPUT_COLUMN}>
                  <FormControl
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
                  >
                    <Select
                      id="model2"
                      value={panel2Model}
                      onChange={(e) => setPanel2Model(e.target.value)}
                    >
                      {filteredModelsP2.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

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
          {/* ----------  END CONTROLS (PANEL 2)  ---------- */}

          {/* VIEW SWITCH */}
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

          {/* YEAR SLIDER */}
          <Box sx={{ mb: 2, px: 1 }}>
            <MuiSlider
              min={2012}
              max={2100}
              value={panel2Year}
              onChange={(e, val) => {
                setPanel2Year(val);
                debouncedUpdatePanel2(val);
              }}
              valueLabelDisplay="auto"
              sx={{ color: '#1976d2' }}
            />
          </Box>

          {/* PANEL 2 DISPLAY */}
          <Box sx={{ width: '100%', height: 400, position: 'relative' }}>
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

      {/* -----------------------  COMBINED LINE CHART  ------------------- */}
      <Box
        className="combined-lineplot"
        sx={{ width: '100%', mt: 3, p: 2, backgroundColor: '#1e1e1e', borderRadius: 1 }}
      >
        <CombinedLinePlot
          point={selectedPoint}
          leftSettings={{
            source:   panel1Source,
            index:    panel1Diversity,
            group:    panel1Group,
            envParam: panel1EnvParam,
            scenario: panel1RCP,
            model:    panel1Model,
          }}
          rightSettings={{
            source:   panel2Source,
            index:    panel2Diversity,
            group:    panel2Group,
            envParam: panel2EnvParam,
            scenario: panel2RCP,
            model:    panel2Model,
          }}
          startYear={2012}
          endYear={endYear}
        />
      </Box>

      {/* -----------------------------  FOOTER  -------------------------- */}
      <Box sx={{ mt: 2 }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default App;

