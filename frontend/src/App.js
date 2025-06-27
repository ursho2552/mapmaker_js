import React, { useState, useMemo } from 'react';
import GlobeDisplay from './components/GlobeDisplay';
import MapDisplay from './components/MapDisplay';
import CombinedLinePlot from './components/CombinedLinePlot';
import Footer from './components/Footer';
import ReferencesButton from './components/ReferencesButton';
import ControlPanel from './components/ControlPanel';
import _ from 'lodash';
import './App.css';

/* -------------------------------  MUI ------------------------------- */
import {
  Box,
  Typography,
  FormControl,
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

/* -------------------------  STATIC OPTIONS -------------------------- */
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

/* -----------------------  INFO TOOLTIP CONTENT ---------------------- */
const infoMessages = {
  // General descriptions
  'Diversity Indices general':
    'Select from several indices that capture different aspects of marine plankton biodiversity.',
  'Plankton Groups general':
    'Choose a plankton group category to filter data by specific taxonomic or functional groups.',
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

const App = () => {
  /* --------------  Top-level state  ------------------------------- */
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalText, setInfoModalText] = useState('');

  /* --------------  clicked point for line-plot  -------------------- */
  const [selectedPoint, setSelectedPoint] = useState({ x: null, y: null });

  /* --------------  Panel-specific state  --------------------------- */
  const createPanelState = () => ({
    year: 2012,
    debouncedYear: 2012,
    source: 'plankton',
    view: 'map',
    diversity: diversityIndices[1],
    envParam: environmentalParameters[0],
    group: planktonGroups[0],
    rcp: rcpScenarios[0],
    model: earthModels[0],
  });

  const [panel1, setPanel1] = useState(createPanelState);
  const [panel2, setPanel2] = useState({ ...createPanelState(), source: 'environmental', view: 'globe' });

  /* --------------  Debounce helpers  ------------------------------- */
  const debouncedUpdateYear = useMemo(
    () => _.debounce((setter, y) => setter(y), 500),
    []
  );

  /* ---------------------------  Helpers  --------------------------- */
  const openInfoModal = (key) => {
    setInfoModalText(infoMessages[key] ?? 'No information available');
    setInfoModalOpen(true);
  };
  const closeInfoModal = () => setInfoModalOpen(false);

  const LABEL_COLUMN = { width: '100px', display: 'flex', alignItems: 'center', gap: 1 };
  const INPUT_COLUMN = { flexGrow: 1, display: 'flex', alignItems: 'center' };
  const ICON_COLUMN = { width: '62px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' };

  /* -------------------  Filter helpers (biomes) -------------------- */
  const filterBiomes = (diversity) => ({
    groups: diversity === 'Biomes' ? planktonGroups.slice(0, 1) : planktonGroups,
    rcp: diversity === 'Biomes' ? rcpScenarios.slice(0, 3) : rcpScenarios,
    models: diversity === 'Biomes' ? earthModels.slice(0, 1) : earthModels,
  });

  return (
    <Box className="App" sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: 0 }}>
      {/* Header */}
      <Box component="header" sx={{ backgroundColor: '#fff', py: 2, px: 4, position: 'relative', textAlign: 'center', fontcolor: "black" }}>
        <Typography variant="h1" sx={{ fontSize: '3.5rem', fontWeight: 'bold', color: "black" }}>
          MAPMAKER
        </Typography>
        <Typography variant="h6" sx={{ fontSize: '1.25rem', color: 'gray', mt: 1 }}>
          Marine Plankton diversity bioindicator scenarios for policy MAKERs
        </Typography>
        <ReferencesButton sx={{ position: 'absolute', top: '30%', right: 16, transform: 'translateY(-50%)' }} />
      </Box>

      {/* ---------------------- INFO MODAL --------------------------- */}
      <Dialog open={infoModalOpen} onClose={closeInfoModal} maxWidth="sm" fullWidth>
        <DialogTitle>Explanation</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{infoModalText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeInfoModal}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ==================== DUAL DISPLAY PANELS ==================== */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', p: 2 }}>
        {/* ######################## PANEL 1 ########################## */}
        <Box sx={{ flex: 1, minWidth: 300, p: 2, backgroundColor: 'black', borderRadius: 1 }}>
          <ControlPanel
            source={panel1.source}
            onSourceChange={(e) => setPanel1({ ...panel1, source: e.target.value })}
            diversity={panel1.diversity}
            onDiversityChange={(e) => setPanel1({ ...panel1, diversity: e.target.value })}
            envParam={panel1.envParam}
            onEnvParamChange={(e) => setPanel1({ ...panel1, envParam: e.target.value })}
            group={panel1.group}
            onGroupChange={(e) => setPanel1({ ...panel1, group: e.target.value })}
            rcp={panel1.rcp}
            onRcpChange={(e) => setPanel1({ ...panel1, rcp: e.target.value })}
            model={panel1.model}
            onModelChange={(e) => setPanel1({ ...panel1, model: e.target.value })}
            filteredGroups={filterBiomes(panel1.diversity).groups}
            filteredScenarios={filterBiomes(panel1.diversity).rcp}
            filteredModels={filterBiomes(panel1.diversity).models}
            diversityIndices={diversityIndices}
            environmentalParameters={environmentalParameters}
            openInfoModal={openInfoModal}
            labelColumn={LABEL_COLUMN}
            inputColumn={INPUT_COLUMN}
            iconColumn={ICON_COLUMN}
          />

          {/* VIEW SWITCH */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={panel1.view}
                onChange={(e) => setPanel1({ ...panel1, view: e.target.value })}
              >
                <FormControlLabel
                  value="map"
                  control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />}
                  label={<Typography color="white">Map</Typography>}
                />
                <FormControlLabel
                  value="globe"
                  control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />}
                  label={<Typography color="white">Globe</Typography>}
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* YEAR SLIDER */}
          <Box sx={{ mb: 2, px: 1 }}>
            <Typography color="white" variant="subtitle2" gutterBottom>
              Year: {panel1.year}
            </Typography>
            <MuiSlider
              min={2012}
              max={2100}
              value={panel1.year}
              onChange={(e, v) => {
                setPanel1({ ...panel1, year: v });
                debouncedUpdateYear((y) => setPanel1({ ...panel1, debouncedYear: y }), v);
              }}
              valueLabelDisplay="auto"
              sx={{ color: '#1976d2' }}
            />
          </Box>

          {/* PANEL 1 DISPLAY */}
          <Box sx={{ width: '100%', height: 400, position: 'relative' }}>
            {panel1.source === 'plankton' && panel1.view === 'map' && (
              <MapDisplay
                year={panel1.year}
                index={panel1.diversity}
                group={panel1.group}
                scenario={panel1.rcp}
                model={panel1.model}
                sourceType="plankton"
                onPointClick={(x, y) => setSelectedPoint({ x, y })}
              />
            )}
            {panel1.source === 'plankton' && panel1.view === 'globe' && (
              <GlobeDisplay
                year={panel1.debouncedYear}
                index={panel1.diversity}
                group={panel1.group}
                scenario={panel1.rcp}
                model={panel1.model}
                sourceType="plankton"
                onPointClick={(x, y) => setSelectedPoint({ x, y })}
              />
            )}
            {panel1.source === 'environmental' && panel1.view === 'map' && (
              <MapDisplay
                year={panel1.year}
                index={panel1.envParam}
                scenario={panel1.rcp}
                model={panel1.model}
                sourceType="environmental"
                onPointClick={(x, y) => setSelectedPoint({ x, y })}
              />
            )}
            {panel1.source === 'environmental' && panel1.view === 'globe' && (
              <GlobeDisplay
                year={panel1.debouncedYear}
                index={panel1.envParam}
                scenario={panel1.rcp}
                model={panel1.model}
                sourceType="environmental"
                onPointClick={(x, y) => setSelectedPoint({ x, y })}
              />
            )}
          </Box>
        </Box>

        {/* ######################## PANEL 2 ########################## */}
        <Box sx={{ flex: 1, minWidth: 300, p: 2, backgroundColor: 'black', borderRadius: 1 }}>
          <ControlPanel
            source={panel2.source}
            onSourceChange={(e) => setPanel2({ ...panel2, source: e.target.value })}
            diversity={panel2.diversity}
            onDiversityChange={(e) => setPanel2({ ...panel2, diversity: e.target.value })}
            envParam={panel2.envParam}
            onEnvParamChange={(e) => setPanel2({ ...panel2, envParam: e.target.value })}
            group={panel2.group}
            onGroupChange={(e) => setPanel2({ ...panel2, group: e.target.value })}
            rcp={panel2.rcp}
            onRcpChange={(e) => setPanel2({ ...panel2, rcp: e.target.value })}
            model={panel2.model}
            onModelChange={(e) => setPanel2({ ...panel2, model: e.target.value })}
            filteredGroups={filterBiomes(panel2.diversity).groups}
            filteredScenarios={filterBiomes(panel2.diversity).rcp}
            filteredModels={filterBiomes(panel2.diversity).models}
            diversityIndices={diversityIndices}
            environmentalParameters={environmentalParameters}
            openInfoModal={openInfoModal}
            labelColumn={LABEL_COLUMN}
            inputColumn={INPUT_COLUMN}
            iconColumn={ICON_COLUMN}
          />

          {/* VIEW SWITCH */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={panel2.view}
                onChange={(e) => setPanel2({ ...panel2, view: e.target.value })}
              >
                <FormControlLabel
                  value="map"
                  control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />}
                  label={<Typography color="white">Map</Typography>}
                />
                <FormControlLabel
                  value="globe"
                  control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />}
                  label={<Typography color="white">Globe</Typography>}
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* YEAR SLIDER */}
          <Box sx={{ mb: 2, px: 1 }}>
            <Typography color="white" variant="subtitle2" gutterBottom>
              Year: {panel2.year}
            </Typography>
            <MuiSlider
              min={2012}
              max={2100}
              value={panel2.year}
              onChange={(e, v) => {
                setPanel2({ ...panel2, year: v });
                debouncedUpdateYear((y) => setPanel2({ ...panel2, debouncedYear: y }), v);
              }}
              valueLabelDisplay="auto"
              sx={{ color: '#1976d2' }}
            />
          </Box>

          {/* PANEL 2 DISPLAY */}
          <Box sx={{ width: '100%', height: 400, position: 'relative' }}>
            {panel2.source === 'plankton' && panel2.view === 'map' && (
              <MapDisplay
                year={panel2.year}
                index={panel2.diversity}
                group={panel2.group}
                scenario={panel2.rcp}
                model={panel2.model}
                sourceType="plankton"
                onPointClick={(x, y) => setSelectedPoint({ x, y })}
              />
            )}
            {panel2.source === 'plankton' && panel2.view === 'globe' && (
              <GlobeDisplay
                year={panel2.debouncedYear}
                index={panel2.diversity}
                group={panel2.group}
                scenario={panel2.rcp}
                model={panel2.model}
                sourceType="plankton"
                onPointClick={(x, y) => setSelectedPoint({ x, y })}
              />
            )}
            {panel2.source === 'environmental' && panel2.view === 'map' && (
              <MapDisplay
                year={panel2.year}
                index={panel2.envParam}
                scenario={panel2.rcp}
                model={panel2.model}
                sourceType="environmental"
                onPointClick={(x, y) => setSelectedPoint({ x, y })}
              />
            )}
            {panel2.source === 'environmental' && panel2.view === 'globe' && (
              <GlobeDisplay
                year={panel2.debouncedYear}
                index={panel2.envParam}
                scenario={panel2.rcp}
                model={panel2.model}
                sourceType="environmental"
                onPointClick={(x, y) => setSelectedPoint({ x, y })}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* ----------------- COMBINED LINE PLOT ------------------------ */}
      <Box sx={{ width: '100%', p: 2, backgroundColor: '#1e1e1e', borderRadius: 1, mt: 3 }}>
        <CombinedLinePlot
          point={selectedPoint}
          leftSettings={{
            source: panel1.source,
            index: panel1.diversity,
            group: panel1.group,
            scenario: panel1.rcp,
            model: panel1.model,
            envParam: panel1.envParam
          }}
          rightSettings={{
            source: panel2.source,
            index: panel2.diversity,
            group: panel2.group,
            scenario: panel2.rcp,
            model: panel2.model,
            envParam: panel2.envParam
          }}
          startYear={2012}
          endYear={2100}
        />
      </Box>


      {/* Footer */}
      <Box sx={{ mt: 2 }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default App;
