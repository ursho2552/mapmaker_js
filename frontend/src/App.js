import React, { useState, useMemo, useEffect } from 'react';
import CombinedLinePlot from './components/CombinedLinePlot';
import Footer from './components/Footer';
import ReferencesButton from './components/ReferencesButton';
import DataPanel from './components/DataPanel';
import ControlPanel from './components/ControlPanel';
import InfoModal from './components/InfoModal';
import ProjectExplanationModal from './components/ProjectExplanationModal';
import _ from 'lodash';
import './App.css';
import { Box, Typography } from '@mui/material';
import { diversityIndices, environmentalParameters, planktonGroups, rcpScenarios, earthModels, infoMessages, infoMessagesShort } from './constants';
import { Lock, LockOpen } from '@mui/icons-material';

const App = () => {
  // Top-level state
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalText, setInfoModalText] = useState('');
  const [infoModalShortText, setInfoModalShortText] = useState('');
  const [infoModalTitle, setInfoModalTitle] = useState('');

  const [selectedPoint, setSelectedPoint] = useState({ x: 0, y: 0 });

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
  const [projectModalOpen, setProjectModalOpen] = useState(true);

  // Separate locks
  const [lockScenario, setLockScenario] = useState(false);
  const [lockModel, setLockModel] = useState(false);

  const [debouncedYear1, setDebouncedYear1] = useState(2012);
  const [debouncedYear2, setDebouncedYear2] = useState(2012);
  const debouncedUpdateYear1 = useMemo(() => _.debounce((y) => setDebouncedYear1(y), 500), []);
  const debouncedUpdateYear2 = useMemo(() => _.debounce((y) => setDebouncedYear2(y), 500), []);

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

  return (
    <Box className="App" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ProjectExplanationModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      />

      <Box component="header" sx={{ backgroundColor: 'transparent', py: 2, px: 4, position: 'relative', textAlign: 'center', fontcolor: "black" }}>
        <Typography variant="h1" sx={{ fontSize: '3.5rem', fontWeight: 'bold', color: "black" }}>
          MAPMAKER
        </Typography>
        <Typography variant="h6" sx={{ fontSize: '1.25rem', color: 'gray', mt: 1 }}>
          MArine Plankton diversity bioindicator scenarios for policy MAKERs
        </Typography>
        <ReferencesButton sx={{ position: 'absolute', top: '30%', right: 16, transform: 'translateY(-50%)' }} />
      </Box>

      <InfoModal
        open={infoModalOpen}
        onClose={closeInfoModal}
        title={infoModalTitle}
        shortText={infoModalShortText}
        longText={infoModalText}
      />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1, px: 1 }}>
        <Box sx={{ flex: 5, display: 'flex' }}>
          <DataPanel
            panel={panel1}
            setPanel={setPanel1}
            debouncedYear={debouncedYear1}
            debouncedUpdateYear={debouncedUpdateYear1}
            setSelectedPoint={setSelectedPoint}
            selectedPoint={selectedPoint}
          />
        </Box>

        <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 1 }}>
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

            {/* Lock Icons */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 3,
                alignSelf: 'center',
                pb: 2,
              }}
            >
              {/* Scenario lock */}
              <Box
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: '#1976d2' },
                  display: 'flex',
                  alignItems: 'center',
                }}
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
                sx={{
                  cursor: 'pointer',
                  '&:hover': { color: '#1976d2' },
                  display: 'flex',
                  alignItems: 'center',
                }}
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

        <Box sx={{ flex: 5, display: 'flex' }}>
          <DataPanel
            panel={panel2}
            setPanel={setPanel2}
            debouncedYear={debouncedYear2}
            debouncedUpdateYear={debouncedUpdateYear2}
            setSelectedPoint={setSelectedPoint}
            selectedPoint={selectedPoint}
          />
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default App;
