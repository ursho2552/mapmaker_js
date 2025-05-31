// App.js
import React, { useState, useMemo } from 'react';
import GlobeDisplay from './components/GlobeDisplay';
import MapDisplay from './components/MapDisplay';
import CombinedLinePlot from './components/CombinedLinePlot';
import Footer from './components/Footer';
import _ from 'lodash';

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
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Options for each dropdown
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

// Custom modal text for diversity indices
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

// Custom modal text for plankton groups
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

// Custom modal text for RCP scenarios
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

// Custom modal text for earth system models
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

const App = () => {
  // Main (top-level) states
  const [selectedDiversity, setSelectedDiversity] = useState(diversityIndices[1]);
  const [selectedPlankton, setSelectedPlankton] = useState(planktonGroups[0]);
  const [selectedRCP, setSelectedRCP] = useState(rcpScenarios[0]);
  const [selectedModel, setSelectedModel] = useState(earthModels[0]);
  const [selectedEnvParam, setSelectedEnvParam] = useState(environmentalParameters[0]);

  // Panel 1 states
  const [panel1Year, setPanel1Year] = useState(2012);
  const [panel1DebouncedYear, setPanel1DebouncedYear] = useState(2012);
  // Radio-based data source for panel 1
  const [panel1Source, setPanel1Source] = useState('plankton'); // "plankton" or "environmental"
  const [panel1View, setPanel1View] = useState('map'); // "map" or "globe"
  const [panel1EnvParam, setPanel1EnvParam] = useState(environmentalParameters[0]);
  const [panel1Diversity, setPanel1Diversity] = useState(selectedDiversity);
  const [panel1Group, setPanel1Group] = useState(selectedPlankton);
  const [panel1RCP, setPanel1RCP] = useState(selectedRCP);
  const [panel1Model, setPanel1Model] = useState(selectedModel);

  // Panel 2 states
  const [panel2Year, setPanel2Year] = useState(2012);
  const [panel2DebouncedYear, setPanel2DebouncedYear] = useState(2012);
  // Radio-based data source for panel 2
  const [panel2Source, setPanel2Source] = useState('environmental'); // "plankton" or "environmental"
  const [panel2View, setPanel2View] = useState('globe'); // "map" or "globe"
  const [panel2EnvParam, setPanel2EnvParam] = useState(environmentalParameters[0]);
  const [panel2Diversity, setPanel2Diversity] = useState(selectedDiversity);
  const [panel2Group, setPanel2Group] = useState(selectedPlankton);
  const [panel2RCP, setPanel2RCP] = useState(selectedRCP);
  const [panel2Model, setPanel2Model] = useState(selectedModel);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');

  // For combined line chart
  const [selectedPoint, setSelectedPoint] = useState({ x: null, y: null });
  const endYear = 2100;

  // When user clicks on the map/globe => we record that lat/lon or something for the chart
  const handlePointClick = (x, y) => setSelectedPoint({ x, y });

  // Filter RCP scenarios based on selected diversity index
  const filteredRcpScenarios = selectedDiversity === 'Biomes'
    ? rcpScenarios.slice(0, 3)
    : rcpScenarios;
  const filteredEarthModels = selectedDiversity === 'Biomes'
    ? earthModels.slice(0, 1)
    : earthModels;
  const filteredPlanktonGroups = selectedDiversity === 'Biomes'
    ? planktonGroups.slice(0, 1)
    : planktonGroups;

  // Filtered for each panel individually
  const filteredRcpScenariosPanel1 = panel1Diversity === 'Biomes'
    ? rcpScenarios.slice(0, 3)
    : rcpScenarios;
  const filteredModelsPanel1 = panel1Diversity === 'Biomes'
    ? earthModels.slice(0, 1)
    : earthModels;
  const filteredGroupsPanel1 = panel1Diversity === 'Biomes'
    ? planktonGroups.slice(0, 1)
    : planktonGroups;

  const filteredRcpScenariosPanel2 = panel2Diversity === 'Biomes'
    ? rcpScenarios.slice(0, 3)
    : rcpScenarios;
  const filteredModelsPanel2 = panel2Diversity === 'Biomes'
    ? earthModels.slice(0, 1)
    : earthModels;
  const filteredGroupsPanel2 = panel2Diversity === 'Biomes'
    ? planktonGroups.slice(0, 1)
    : planktonGroups;

  // Debouncing year changes to avoid re-render spamming
  const debouncedUpdatePanel1 = useMemo(
    () => _.debounce((newYear) => setPanel1DebouncedYear(newYear), 500),
    []
  );
  const debouncedUpdatePanel2 = useMemo(
    () => _.debounce((newYear) => setPanel2DebouncedYear(newYear), 500),
    []
  );

  // Open dialog with custom text
  const openModal = (category) => {
    let text = '';
    if (category.endsWith(' general')) {
      const key = category.replace(/ general$/, '');
      switch (key) {
        case 'Diversity Indices':
          text = 'Different diversity indices based on the Habitat Suitability Index.';
          break;
        case 'Plankton Groups':
          text = 'Marine taxonomic groupings important for global ecosystem services provided by our oceans.';
          break;
        case 'RCP Scenarios':
          text = 'Representative Concentration Pathways describe greenhouse gas trajectories and radiative forcing scenarios.';
          break;
        case 'Earth System Models':
          text = 'Earth System Models are coupled climate-biogeochemical models used for projecting environmental changes.';
          break;
        default:
          text = 'No information available';
      }
    } else {
      // Value-level help
      if (diversityMessages[category]) text = diversityMessages[category];
      else if (planktonMessages[category]) text = planktonMessages[category];
      else if (rcpMessages[category]) text = rcpMessages[category];
      else if (modelMessages[category]) text = modelMessages[category];
      else text = 'No information available';
    }
    setModalText(text);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Styles
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    gap: '8px',
  };
  const placeholderStyle = { minHeight: '1.9em' };

  return (
    <Box className="App" sx={{ backgroundColor: '#121212', minHeight: '100vh', p: 2 }}>
      {/* Header */}
      <Box component="header" sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" color="white">
          Marine Plankton diversity bioindicator scenarios for policy <b>MAKER</b>s, <b>MAPMAKER</b>
        </Typography>
      </Box>

      {/* Dialog Popup */}
      <Dialog open={modalOpen} onClose={closeModal}>
        <DialogTitle>Explanation</DialogTitle>
        <DialogContent dividers>
          <Typography>{modalText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dual Data Panels */}
      <Box
        className="dual-display"
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        {/* Panel 1 */}
        <Box
          className="display-panel"
          sx={{
            flex: 1,
            minWidth: 300,
            p: 2,
            backgroundColor: '#1e1e1e',
            borderRadius: 1,
          }}
        >
          <Box className="panel-controls" sx={{ mb: 2 }}>
            {/* Data type radio buttons */}
            <Box sx={rowStyle}>
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

            {/* View selection via radio buttons */}
            <Box sx={rowStyle}>
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

            {/* Row 1: (Index for Plankton) or (Metric for Environmental) */}
            <Box sx={rowStyle}>
              {panel1Source === 'plankton' ? (
                <>
                  <Typography color="white">Index:</Typography>
                  <IconButton onClick={() => openModal('Diversity Indices general')} size="small">
                    <InfoOutlinedIcon sx={{ color: 'white' }} fontSize="small" />
                  </IconButton>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="diversity1-label">Select Index</InputLabel>
                    <Select
                      labelId="diversity1-label"
                      id="diversity1"
                      value={panel1Diversity}
                      onChange={(e) => setPanel1Diversity(e.target.value)}
                      label="Select Index"
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: 1,
                      }}
                    >
                      {diversityIndices.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton onClick={() => openModal(panel1Diversity)} size="small">
                    <InfoOutlinedIcon sx={{ color: 'white' }} fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <>
                  <Typography color="white" sx={{ mr: 1 }}>
                    Metric:
                  </Typography>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="env1-label">Select Metric</InputLabel>
                    <Select
                      labelId="env1-label"
                      id="env1"
                      value={panel1EnvParam}
                      onChange={(e) => setPanel1EnvParam(e.target.value)}
                      label="Select Metric"
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: 1,
                      }}
                    >
                      {environmentalParameters.map((param) => (
                        <MenuItem key={param} value={param}>
                          {param}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}
            </Box>

            {/* Row 2: Group (plankton) or empty (environmental) */}
            <Box sx={rowStyle}>
              {panel1Source === 'plankton' ? (
                <>
                  <Typography color="white">Group:</Typography>
                  <IconButton onClick={() => openModal('Plankton Groups general')} size="small">
                    <InfoOutlinedIcon sx={{ color: 'white' }} fontSize="small" />
                  </IconButton>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="group1-label">Select Group</InputLabel>
                    <Select
                      labelId="group1-label"
                      id="group1"
                      value={panel1Group}
                      onChange={(e) => setPanel1Group(e.target.value)}
                      label="Select Group"
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: 1,
                      }}
                    >
                      {filteredGroupsPanel1.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton onClick={() => openModal(panel1Group)} size="small">
                    <InfoOutlinedIcon sx={{ color: 'white' }} fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <Box sx={placeholderStyle} />
              )}
            </Box>

            {/* Row 3: Scenario (plankton) or empty (environmental) */}
            <Box sx={rowStyle}>
              {panel1Source === 'plankton' ? (
                <>
                  <Typography color="white">Scenario:</Typography>
                  <IconButton onClick={() => openModal('RCP Scenarios general')} size="small">
                    <InfoOutlinedIcon sx={{ color: 'white' }} fontSize="small" />
                  </IconButton>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="rcp1-label">Select Scenario</InputLabel>
                    <Select
                      labelId="rcp1-label"
                      id="rcp1"
                      value={panel1RCP}
                      onChange={(e) => setPanel1RCP(e.target.value)}
                      label="Select Scenario"
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: 1,
                      }}
                    >
                      {filteredRcpScenariosPanel1.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton onClick={() => openModal(panel1RCP)} size="small">
                    <InfoOutlinedIcon sx={{ color: 'white' }} fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <Box sx={placeholderStyle} />
              )}
            </Box>

            {/* Row 4: Model (plankton) or empty (environmental) */}
            <Box sx={rowStyle}>
              {panel1Source === 'plankton' ? (
                <>
                  <Typography color="white">Model:</Typography>
                  <IconButton onClick={() => openModal('Earth System Models general')} size="small">
                    <InfoOutlinedIcon sx={{ color: 'white' }} fontSize="small" />
                  </IconButton>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="model1-label">Select Model</InputLabel>
                    <Select
                      labelId="model1-label"
                      id="model1"
                      value={panel1Model}
                      onChange={(e) => setPanel1Model(e.target.value)}
                      label="Select Model"
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: 1,
                      }}
                    >
                      {filteredModelsPanel1.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton onClick={() => openModal(panel1Model)} size="small">
                    <InfoOutlinedIcon sx={{ color: 'white' }} fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <Box sx={placeholderStyle} />
              )}
            </Box>
          </Box>

          {/* Year Slider for Panel 1 */}
          <Box sx={{ mb: 2, px: 1 }}>
            <Typography color="white" gutterBottom>
              Year: {panel1Year}
            </Typography>
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

          {/* Render Panel 1 content based on selection */}
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
              scenario={panel1RCP} // optional if your environmental data uses scenario
              model={panel1Model} // optional if your environmental data uses model
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

        {/* Panel 2 */}
        <Box
          className="display-panel"
          sx={{
            flex: 1,
            minWidth: 300,
            p: 2,
            backgroundColor: '#1e1e1e',
            borderRadius: 1,
          }}
        >
          <Box className="panel-controls" sx={{ mb: 2 }}>
            {/* Data type radio buttons */}
            <Box sx={rowStyle}>
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

            {/* View selection via radio buttons */}
            <Box sx={rowStyle}>
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

            {/* Row 1: (Index for Plankton) or (Metric for Environmental) */}
            <Box sx={rowStyle}>
              {panel2Source === 'plankton' ? (
                <>
                  <Typography color="white">Index:</Typography>
                  <IconButton onClick={() => openModal('Diversity Indices general')} size="small">
                    <InfoOutlinedIcon sx={{ color: 'white' }} fontSize="small" />
                  </IconButton>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="diversity2-label">Select Index</InputLabel>
                    <Select
                      labelId="diversity2-label"
                      id="diversity2"
                      value={panel2Diversity}
                      onChange={(e) => setPanel2Diversity(e.target.value)}
                      label="Select Index"
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: 1,
                      }}
                    >
                      {diversityIndices.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton onClick={() => openModal(panel2Diversity)} size="small">
                    <InfoOutlinedIcon sx={{ color: 'white' }} fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <>
                  <Typography color="white" sx={{ mr: 1 }}>
                    Metric:
                  </Typography>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="env2-label">Select Metric</InputLabel>
                    <Select
                      labelId="env2-label"
                      id="env2"
                      value={panel2EnvParam}
                      onChange={(e) => setPanel2EnvParam(e.target.value)}
                      label="Select Metric"
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: 1,
                      }}
                    >
                      {environmentalParameters.map((param) => (
                        <MenuItem key={param} value={param}>
                          {param}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}
            </Box>

            {/* Row 2: Group (plankton) or empty (environmental) */}
            <Box sx={rowStyle}>
              {panel2Source === 'plankton' ? (
                <>
                  <Typography color="white">Group:</Typography>
                  <IconButton onClick={() => openModal('Plankton Groups general')} size="small">
                    <InfoOutlinedIcon sx={{ color: 'white' }} fontSize="small" />
                  </IconButton>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="group2-label">Select Group</InputLabel>
                    <Select
                      labelId="group2-label"
                      id="group2"
                      value={panel2Group}
                      onChange={(e) => setPanel2Group(e.target.value)}
                      label="Select Group"
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: 1,
                      }}
                    >
                      {filteredGroupsPanel2.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton onClick={() => openModal(panel2Group)} size="small">
                    <InfoOutlinedIcon sx={{ color: 'white' }} fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <Box sx={placeholderStyle} />
              )}
            </Box>

            {/* Row 3: Scenario (plankton) or empty (environmental) */}
            <Box sx={rowStyle}>
              {panel2Source === 'plankton' ? (
                <>
                  <Typography color="white">Scenario:</Typography>
                  <IconButton onClick={() => openModal('RCP Scenarios general')} size="small">
                    <InfoOutlinedIcon sx={{ color: 'white' }} fontSize="small" />
                  </IconButton>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="rcp2-label">Select Scenario</InputLabel>
                    <Select
                      labelId="rcp2-label"
                      id="rcp2"
                      value={panel2RCP}
                      onChange={(e) => setPanel2RCP(e.target.value)}
                      label="Select Scenario"
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: 1,
                      }}
                    >
                      {filteredRcpScenariosPanel2.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton onClick={() => openModal(panel2RCP)} size="small">
                    <InfoOutlinedIcon sx={{ color: 'white' }} fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <Box sx={placeholderStyle} />
              )}
            </Box>

            {/* Row 4: Model (plankton) or empty (environmental) */}
            <Box sx={rowStyle}>
              {panel2Source === 'plankton' ? (
                <>
                  <Typography color="white">Model:</Typography>
                  <IconButton onClick={() => openModal('Earth System Models general')} size="small">
                    <InfoOutlinedIcon sx={{ color: 'white' }} fontSize="small" />
                  </IconButton>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="model2-label">Select Model</InputLabel>
                    <Select
                      labelId="model2-label"
                      id="model2"
                      value={panel2Model}
                      onChange={(e) => setPanel2Model(e.target.value)}
                      label="Select Model"
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: 1,
                      }}
                    >
                      {filteredModelsPanel2.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton onClick={() => openModal(panel2Model)} size="small">
                    <InfoOutlinedIcon sx={{ color: 'white' }} fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <Box sx={placeholderStyle} />
              )}
            </Box>
          </Box>

          {/* Year Slider for Panel 2 */}
          <Box sx={{ mb: 2, px: 1 }}>
            <Typography color="white" gutterBottom>
              Year: {panel2Year}
            </Typography>
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

          {/* Render Panel 2 content based on selection */}
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
              scenario={panel2RCP} // optional if your environmental data uses scenario
              model={panel2Model} // optional if your environmental data uses model
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

      {/* Combined line chart (full width) for both panels at clicked point */}
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

      <Box sx={{ mt: 3 }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default App;
