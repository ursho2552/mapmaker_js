import React, { useState, useMemo, useEffect } from 'react';
import _ from 'lodash';
import './App.css';

import { Box, Typography, Divider, IconButton, Collapse, Button } from '@mui/material';
import { Lock, LockOpen, ExpandLess, ExpandMore } from '@mui/icons-material';

import CombinedLinePlot from './components/CombinedLinePlot';
import ReferencesButton from './components/ReferencesButton';
import DataPanel from './components/DataPanel';
import ControlPanel from './components/ControlPanel';
import InfoModal from './components/InfoModal';
import ProjectExplanationModal from './components/ProjectExplanationModal';
import Tutorial from './components/Tutorial';

import {
  diversityIndices,
  environmentalParameters,
  planktonGroups,
  rcpScenarios,
  earthModels,
  infoMessages,
  infoMessagesShort
} from './constants';

const App = () => {
  // Tutorial
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Info Modal
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState('');
  const [infoModalText, setInfoModalText] = useState('');
  const [infoModalShortText, setInfoModalShortText] = useState('');

  // Project Modal
  const [projectModalOpen, setProjectModalOpen] = useState(true);

  // Selected point
  const [selectedPoint, setSelectedPoint] = useState({ x: 0, y: 0 });

  // Panel states
  const createPanelState = (overrides = {}) => ({
    year: 2025,
    debouncedYear: 2025,
    source: 'plankton',
    view: 'map',
    diversity: diversityIndices[1],
    envParam: environmentalParameters[0],
    group: planktonGroups[0],
    rcp: rcpScenarios[0],
    model: earthModels[0],
    ...overrides
  });

  const [panel1, setPanel1] = useState(createPanelState());
  const [panel2, setPanel2] = useState(createPanelState({ source: 'environmental', view: 'globe' }));

  // Locks
  const [lockScenario, setLockScenario] = useState(true);
  const [lockModel, setLockModel] = useState(true);
  const [lockYear, setLockYear] = useState(true);

  // Debounced years
  const [debouncedYear1, setDebouncedYear1] = useState(2012);
  const [debouncedYear2, setDebouncedYear2] = useState(2012);

  const debouncedUpdateYear1 = useMemo(() => _.debounce(setDebouncedYear1, 500), []);
  const debouncedUpdateYear2 = useMemo(() => _.debounce(setDebouncedYear2, 500), []);

  // Collapsible panels
  const [panelsCollapsed, setPanelsCollapsed] = useState(false);

  useEffect(() => setProjectModalOpen(true), []);

  // Modal handlers
  const openInfoModal = (title, key) => {
    setInfoModalTitle(title);
    setInfoModalShortText(infoMessagesShort[key] ?? 'No short description available');
    setInfoModalText(infoMessages[key] ?? 'No information available');
    setInfoModalOpen(true);
  };

  const closeInfoModal = () => setInfoModalOpen(false);

  // Biome filter
  const filterBiomes = (diversity) => ({
    groups: diversity === 'Biomes' ? planktonGroups.slice(0, 1) : planktonGroups,
    rcp: diversity === 'Biomes' ? rcpScenarios.slice(0, 3) : rcpScenarios,
    models: diversity === 'Biomes' ? earthModels.slice(0, 1) : earthModels
  });

  // Panel change handlers with locks
  const handlePanelChange = (panelSetter, otherPanelSetter, key, value, lock, syncKey) => {
    panelSetter(prev => ({ ...prev, [key]: value }));
    if (lock) {
      otherPanelSetter(prev => ({ ...prev, [syncKey]: value }));
    }
  };

  const handleYearLockToggle = () => {
    const newLock = !lockYear;
    setLockYear(newLock);
    if (newLock) setPanel2(prev => ({ ...prev, year: panel1.year }));
  };

  return (
    <Box className="App" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Start Tutorial */}
      <Box sx={{ position: 'absolute', top: 30, left: 30, zIndex: 1500 }}>
        <Button variant="outlined" onClick={() => setTutorialActive(true)}>Start Tutorial</Button>
      </Box>

      {/* Tutorial */}
      <Tutorial
        start={tutorialActive}
        onFinish={() => { setTutorialActive(false); setTutorialStep(0); }}
        panel1Year={panel1.year}
        setPanel1Year={(y) => handlePanelChange(setPanel1, setPanel2, 'year', y, lockYear, 'year')}
        setTutorialStep={setTutorialStep}
      />

      {/* Project Modal */}
      <ProjectExplanationModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      />

      {/* Header */}
      <Box component="header" sx={{ backgroundColor: 'transparent', mt: 2, px: 4, position: 'relative', textAlign: 'center' }}>
        <Typography variant="h1" sx={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'white' }}>MAPMAKER</Typography>
        <Typography variant="h6" sx={{ fontSize: '1.25rem', color: 'white', mt: 1 }}>
          MArine Plankton diversity bioindicator scenarios for policy MAKERs
        </Typography>
        <ReferencesButton sx={{ position: 'absolute', top: '30%', right: 16, transform: 'translateY(-50%)' }} />
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', mb: 2 }} />

      {/* Info Modal */}
      <InfoModal
        open={infoModalOpen}
        onClose={closeInfoModal}
        title={infoModalTitle}
        shortText={infoModalShortText}
        longText={infoModalText}
      />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 1, px: 1 }}>
        {/* Left Data Panel */}
        <DataPanel
          panel={panel1}
          setPanel={setPanel1}
          tutorialStep={tutorialStep}
          debouncedYear={debouncedYear1}
          debouncedUpdateYear={debouncedUpdateYear1}
          setSelectedPoint={setSelectedPoint}
          selectedPoint={selectedPoint}
          lockYear={lockYear}
          onYearChange={(y) => handlePanelChange(setPanel1, setPanel2, 'year', y, lockYear, 'year')}
          onLockToggle={handleYearLockToggle}
        />

        {/* Control Panels & Line Plot */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Collapsible Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)', px: 2, py: 1, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: 'white' }}>Control Panels</Typography>
            <IconButton onClick={() => setPanelsCollapsed(!panelsCollapsed)} sx={{ color: '#fff', '&:hover': { color: '#4FC3F7', transform: 'scale(1.1)', transition: '0.2s' } }}>
              {panelsCollapsed ? <ExpandMore /> : <ExpandLess />}
            </IconButton>
          </Box>

          <Collapse in={!panelsCollapsed}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'start', columnGap: 1 }}>
              {/* Left Control Panel */}
              <ControlPanel
                {...panel1}
                onSourceChange={(e) => setPanel1({ ...panel1, source: e.target.value })}
                onDiversityChange={(e) => setPanel1({ ...panel1, diversity: e.target.value })}
                onEnvParamChange={(e) => setPanel1({ ...panel1, envParam: e.target.value })}
                onGroupChange={(e) => setPanel1({ ...panel1, group: e.target.value })}
                onRcpChange={(e) => handlePanelChange(setPanel1, setPanel2, 'rcp', e.target.value, lockScenario, 'rcp')}
                onModelChange={(e) => handlePanelChange(setPanel1, setPanel2, 'model', e.target.value, lockModel, 'model')}
                filteredGroups={filterBiomes(panel1.diversity).groups}
                filteredScenarios={filterBiomes(panel1.diversity).rcp}
                filteredModels={filterBiomes(panel1.diversity).models}
                diversityIndices={diversityIndices}
                environmentalParameters={environmentalParameters}
                openInfoModal={openInfoModal}
                tutorialStep={tutorialStep}
              />

              {/* Locks */}
              <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(4, auto)', rowGap: 3, justifyItems: 'center', pt: 14 }}>

                {/* Scenario Lock */}
                <Box sx={{ cursor: 'pointer', '&:hover': { color: '#1976d2' }, display: 'flex', alignItems: 'center' }}
                  onClick={() => setLockScenario(prev => { if (!prev) setPanel2(p => ({ ...p, rcp: panel1.rcp })); return !prev; })}>
                  {lockScenario ? <Lock /> : <LockOpen />}
                </Box>

                {/* Model Lock */}
                <Box sx={{ cursor: 'pointer', '&:hover': { color: '#1976d2' }, display: 'flex', alignItems: 'center' }}
                  onClick={() => setLockModel(prev => { if (!prev) setPanel2(p => ({ ...p, model: panel1.model })); return !prev; })}>
                  {lockModel ? <Lock /> : <LockOpen />}
                </Box>
              </Box>

              {/* Right Control Panel */}
              <ControlPanel
                {...panel2}
                onSourceChange={(e) => setPanel2({ ...panel2, source: e.target.value })}
                onDiversityChange={(e) => setPanel2({ ...panel2, diversity: e.target.value })}
                onEnvParamChange={(e) => setPanel2({ ...panel2, envParam: e.target.value })}
                onGroupChange={(e) => setPanel2({ ...panel2, group: e.target.value })}
                onRcpChange={(e) => handlePanelChange(setPanel2, setPanel1, 'rcp', e.target.value, lockScenario, 'rcp')}
                onModelChange={(e) => handlePanelChange(setPanel2, setPanel1, 'model', e.target.value, lockModel, 'model')}
                filteredGroups={filterBiomes(panel2.diversity).groups}
                filteredScenarios={filterBiomes(panel2.diversity).rcp}
                filteredModels={filterBiomes(panel2.diversity).models}
                diversityIndices={diversityIndices}
                environmentalParameters={environmentalParameters}
                openInfoModal={openInfoModal}
              />
            </Box>
          </Collapse>

          {/* Combined Line Plot */}
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

        {/* Right Data Panel */}
        <DataPanel
          panel={panel2}
          setPanel={setPanel2}
          tutorialStep={tutorialStep === 1 ? tutorialStep : null}
          debouncedYear={debouncedYear2}
          debouncedUpdateYear={debouncedUpdateYear2}
          setSelectedPoint={setSelectedPoint}
          selectedPoint={selectedPoint}
          lockYear={lockYear}
          onYearChange={(y) => handlePanelChange(setPanel2, setPanel1, 'year', y, lockYear, 'year')}
          onLockToggle={handleYearLockToggle}
        />
      </Box>
    </Box>
  );
};

export default App;