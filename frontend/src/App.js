import React, { useState, useMemo, useEffect } from 'react';
import CombinedLinePlot from './components/CombinedLinePlot';
import Footer from './components/Footer';
import ReferencesButton from './components/ReferencesButton';
import DataPanel from './components/DataPanel';
import ControlPanel from './components/ControlPanel';
import InfoModal from './components/InfoModal';
import ProjectExplanationModal from './components/ProjectExplanationModal';
import Tutorial from './components/Tutorial';
import _ from 'lodash';
import './App.css';
import { Box, Typography, Divider, IconButton, Collapse, Button } from '@mui/material';
import { diversityIndices, environmentalParameters, planktonGroups, rcpScenarios, earthModels, infoMessages, infoMessagesShort } from './constants';
import { Lock, LockOpen, ExpandLess, ExpandMore } from '@mui/icons-material';

const App = () => {
  // Tutorial state
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Top-level state
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalText, setInfoModalText] = useState('');
  const [infoModalShortText, setInfoModalShortText] = useState('');
  const [infoModalTitle, setInfoModalTitle] = useState('');

  const [selectedPoint, setSelectedPoint] = useState({ x: 0, y: 0 });

  const createPanelState = () => ({
    year: 2025,
    debouncedYear: 2025,
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
  const [projectModalOpen, setProjectModalOpen] = useState(true);

  // Locks
  const [lockScenario, setLockScenario] = useState(true);
  const [lockModel, setLockModel] = useState(true);
  const [lockYear, setLockYear] = useState(true);

  // Debounced years
  const [debouncedYear1, setDebouncedYear1] = useState(2012);
  const [debouncedYear2, setDebouncedYear2] = useState(2012);
  const debouncedUpdateYear1 = useMemo(() => _.debounce((y) => setDebouncedYear1(y), 500), []);
  const debouncedUpdateYear2 = useMemo(() => _.debounce((y) => setDebouncedYear2(y), 500), []);

  // Collapsible state
  const [panelsCollapsed, setPanelsCollapsed] = useState(false);

  const openInfoModal = (title, key) => {
    setInfoModalShortText(infoMessagesShort[key] ?? 'No short description available');
    setInfoModalText(infoMessages[key] ?? 'No information available');
    setInfoModalTitle(title);
    setInfoModalOpen(true);
  };
  const closeInfoModal = () => setInfoModalOpen(false);

  const filterBiomes = (diversity) => ({
    groups: diversity === 'Biomes' ? planktonGroups.slice(0, 1) : planktonGroups,
    rcp: diversity === 'Biomes' ? rcpScenarios.slice(0, 3) : rcpScenarios,
    models: diversity === 'Biomes' ? earthModels.slice(0, 1) : earthModels,
  });

  useEffect(() => setProjectModalOpen(true), []);

  // Scenario & Model handlers
  const handleRcpChange = (panelSetter, otherPanelSetter, value) => {
    panelSetter(prev => ({ ...prev, rcp: value }));
    if (lockScenario) {
      otherPanelSetter(prev => ({ ...prev, rcp: value }));
    }
  };

  const handleModelChange = (panelSetter, otherPanelSetter, value) => {
    panelSetter(prev => ({ ...prev, model: value }));
    if (lockModel) {
      otherPanelSetter(prev => ({ ...prev, model: value }));
    }
  };

  const handleYearChange = (panelSetter, otherPanelSetter, year) => {
    panelSetter(prev => ({ ...prev, year }));
    if (lockYear) {
      otherPanelSetter(prev => ({ ...prev, year }));
    }
  };

  const handleYearLockToggle = () => {
    const newLock = !lockYear;
    setLockYear(newLock);

    if (newLock) {
      setPanel2(prev => ({ ...prev, year: panel1.year }));
    }
  };

  return (
    <Box className="App" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Start Tutorial Button */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 1500 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setTutorialActive(true)}
        >
          Start Tutorial
        </Button>
      </Box>

      {/* Tutorial Overlay */}
      <Tutorial
        start={tutorialActive}
        onFinish={() => {
          setTutorialActive(false);
          setTutorialStep(0);
        }}
        panel1Year={panel1.year}
        setPanel1Year={(y) => handleYearChange(setPanel1, setPanel2, y)}
        setTutorialStep={setTutorialStep}
      />

      <ProjectExplanationModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      />

      {/* Header */}
      <Box component="header" sx={{ backgroundColor: 'transparent', mt: 2, px: 4, position: 'relative', textAlign: 'center' }}>
        <Typography variant="h1" sx={{ fontSize: '3.5rem', fontWeight: 'bold', color: "white" }}>
          MAPMAKER
        </Typography>
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

      <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'column', lg: 'row' }, gap: 1, px: 1 }}>
        <Box sx={{ flex: 1, display: 'flex' }}>
          {/* Left DataPanel */}
          <DataPanel
            panel={panel1}
            setPanel={setPanel1}
            tutorialStep={tutorialStep}
            debouncedYear={debouncedYear1}
            debouncedUpdateYear={debouncedUpdateYear1}
            setSelectedPoint={setSelectedPoint}
            selectedPoint={selectedPoint}
            lockYear={lockYear}
            onYearChange={(y) => handleYearChange(setPanel1, setPanel2, y)}
            onLockToggle={handleYearLockToggle}
          />
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Collapsible title */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(8px)',
              px: 2,
              py: 1,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'white',
              }}
            >
              Control Panels
            </Typography>
            <IconButton
              onClick={() => setPanelsCollapsed(!panelsCollapsed)}
              sx={{
                color: '#fff',
                '&:hover': {
                  color: '#4FC3F7',
                  transform: 'scale(1.1)',
                  transition: '0.2s',
                },
              }}
            >
              {panelsCollapsed ? <ExpandMore /> : <ExpandLess />}
            </IconButton>
          </Box>

          {/* Collapsible content */}
          <Collapse in={!panelsCollapsed}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'start',
                columnGap: 1,
              }}
            >
              {/* Left Control Panel */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
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
                  onRcpChange={(e) => handleRcpChange(setPanel1, setPanel2, e.target.value)}
                  model={panel1.model}
                  onModelChange={(e) => handleModelChange(setPanel1, setPanel2, e.target.value)}
                  filteredGroups={filterBiomes(panel1.diversity).groups}
                  filteredScenarios={filterBiomes(panel1.diversity).rcp}
                  filteredModels={filterBiomes(panel1.diversity).models}
                  diversityIndices={diversityIndices}
                  environmentalParameters={environmentalParameters}
                  openInfoModal={openInfoModal}
                />
              </Box>
              {/* Lock Icons */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateRows: 'repeat(4, auto)',
                  rowGap: 3,
                  justifyItems: 'center',
                  pt: 8,
                }}
              >
                <Box />
                <Box />
                {/* Scenario lock */}
                <Box
                  sx={{ cursor: 'pointer', '&:hover': { color: '#1976d2' }, display: 'flex', alignItems: 'center' }}
                  onClick={() => {
                    const newLock = !lockScenario;
                    setLockScenario(newLock);
                    if (newLock) {
                      setPanel2(prev => ({ ...prev, rcp: panel1.rcp }));
                    }
                  }}
                >
                  {lockScenario ? <Lock /> : <LockOpen />}
                </Box>

                {/* Model lock */}
                <Box
                  sx={{ cursor: 'pointer', '&:hover': { color: '#1976d2' }, display: 'flex', alignItems: 'center' }}
                  onClick={() => {
                    const newLock = !lockModel;
                    setLockModel(newLock);
                    if (newLock) {
                      setPanel2(prev => ({ ...prev, model: panel1.model }));
                    }
                  }}
                >
                  {lockModel ? <Lock /> : <LockOpen />}
                </Box>
              </Box>

              {/* Right Control Panel */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
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
                  onRcpChange={(e) => handleRcpChange(setPanel2, setPanel1, e.target.value)}
                  model={panel2.model}
                  onModelChange={(e) => handleModelChange(setPanel2, setPanel1, e.target.value)}
                  filteredGroups={filterBiomes(panel2.diversity).groups}
                  filteredScenarios={filterBiomes(panel2.diversity).rcp}
                  filteredModels={filterBiomes(panel2.diversity).models}
                  diversityIndices={diversityIndices}
                  environmentalParameters={environmentalParameters}
                  openInfoModal={openInfoModal}
                />
              </Box>
            </Box>
          </Collapse>

          {/* Combined line plot */}
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

        <Box sx={{ flex: 1, display: 'flex' }}>
          <DataPanel
            panel={panel2}
            setPanel={setPanel2}
            debouncedYear={debouncedYear2}
            debouncedUpdateYear={debouncedUpdateYear2}
            setSelectedPoint={setSelectedPoint}
            selectedPoint={selectedPoint}
            lockYear={lockYear}
            onYearChange={(y) => handleYearChange(setPanel2, setPanel1, y)}
            onLockToggle={handleYearLockToggle}
          />
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default App;