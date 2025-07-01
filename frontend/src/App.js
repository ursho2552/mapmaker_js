import React, { useState, useMemo } from 'react';
import GlobeDisplay from './components/GlobeDisplay';
import MapDisplay from './components/MapDisplay';
import CombinedLinePlot from './components/CombinedLinePlot';
import Footer from './components/Footer';
import ReferencesButton from './components/ReferencesButton';
import ControlPanel from './components/ControlPanel';
import _ from 'lodash';
import './App.css';
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
import { diversityIndices, environmentalParameters, planktonGroups, rcpScenarios, earthModels, infoMessages } from './constants';

const App = () => {
  // Top-level state
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalText, setInfoModalText] = useState('');

  // Clicked point for line plot
  const [selectedPoint, setSelectedPoint] = useState({ x: null, y: null });

  // Panel specific states
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

      {/* Dual Display Panels */}
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

        {/* Panel */}
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

      {/* Combined Line Plot */}
      <Box sx={{
        backgroundColor: '#1e1e1e',
        borderRadius: 2,
        height: '100%',
        mx: 2,
      }}>

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
