import React, { useState, useMemo, useEffect } from 'react';
import CombinedLinePlot from './components/CombinedLinePlot';
import Footer from './components/Footer';
import ReferencesButton from './components/ReferencesButton';
import DataPanel from './components/DataPanel';
import ControlPanel from './components/ControlPanel';
import ProjectExplanationModal from './components/ProjectExplanationModal';
import _ from 'lodash';
import './App.css';
import {
  Box,
  Typography,
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
  const [selectedPoint, setSelectedPoint] = useState({ x: 0, y: 0 });

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
  const [projectModalOpen, setProjectModalOpen] = useState(true);

  // Debounce helpers
  const [debouncedYear1, setDebouncedYear1] = useState(2012);
  const [debouncedYear2, setDebouncedYear2] = useState(2012);
  const debouncedUpdateYear1 = useMemo(
    () => _.debounce((y) => setDebouncedYear1(y), 500),
    []
  );

  const debouncedUpdateYear2 = useMemo(
    () => _.debounce((y) => setDebouncedYear2(y), 500),
    []
  );

  // Helpers
  const openInfoModal = (key) => {
    setInfoModalText(infoMessages[key] ?? 'No information available');
    setInfoModalOpen(true);
  };
  const closeInfoModal = () => setInfoModalOpen(false);

  const LABEL_COLUMN = { width: '100px', display: 'flex', alignItems: 'center', gap: 1 };
  const INPUT_COLUMN = { flexGrow: 1, display: 'flex', alignItems: 'center' };
  const ICON_COLUMN = { width: '62px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' };

  // Filter helpers (biomes)
  const filterBiomes = (diversity) => ({
    groups: diversity === 'Biomes' ? planktonGroups.slice(0, 1) : planktonGroups,
    rcp: diversity === 'Biomes' ? rcpScenarios.slice(0, 3) : rcpScenarios,
    models: diversity === 'Biomes' ? earthModels.slice(0, 1) : earthModels,
  });

  useEffect(() => {
    setProjectModalOpen(true);
  }, []);

  return (
    <Box className="App" sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: 0 }}>
      <ProjectExplanationModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      />

      {/* Header */}
      <Box component="header" sx={{ backgroundColor: '#fff', py: 2, px: 4, position: 'relative', textAlign: 'center', fontcolor: "black" }}>
        <Typography variant="h1" sx={{ fontSize: '3.5rem', fontWeight: 'bold', color: "black" }}>
          MAPMAKER
        </Typography>
        <Typography variant="h6" sx={{ fontSize: '1.25rem', color: 'gray', mt: 1 }}>
          MArine Plankton diversity bioindicator scenarios for policy MAKERs
        </Typography>
        <ReferencesButton sx={{ position: 'absolute', top: '30%', right: 16, transform: 'translateY(-50%)' }} />
      </Box>

      {/* Info Modal */}
      <Dialog open={infoModalOpen} onClose={closeInfoModal} maxWidth="sm" fullWidth>
        <DialogTitle>Explanation</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{infoModalText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeInfoModal}>Close</Button>
        </DialogActions>
      </Dialog>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          px: 2,
          flexWrap: 'wrap',
        }}
      >
        <DataPanel
          panel={panel1}
          setPanel={setPanel1}
          debouncedYear={debouncedYear1}
          debouncedUpdateYear={debouncedUpdateYear1}
          setSelectedPoint={setSelectedPoint}
          selectedPoint={selectedPoint}
          sx={{ flexGrow: 5 }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 2, flexGrow: 3 }}>
          {/* Control Panel 1 */}
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
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
            { /* Control Panel 2 */}
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
          </Box>

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
            sx={{ width: '100%' }}
          />
        </Box>
        <DataPanel
          panel={panel2}
          setPanel={setPanel2}
          debouncedYear={debouncedYear2}
          debouncedUpdateYear={debouncedUpdateYear2}
          setSelectedPoint={setSelectedPoint}
          selectedPoint={selectedPoint}
          sx={{ flexGrow: 5 }}
        />
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default App;
