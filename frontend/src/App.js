import React, { lazy, Suspense, useState } from 'react';
import { Box, Button, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import ControlPanel, { CONTROL_ROWS } from './components/ControlPanel';
import DataPanel from './components/DataPanel';
import Footer from './components/Footer';
import InfoModal, { HIDE_WELCOME_KEY } from './components/InfoModal';
import LoadingFallback from './components/LoadingFallback';
import ReferencesButton from './components/ReferencesButton';
import Tutorial from './components/Tutorial';
import CollapsiblePanel from './components/common/CollapsiblePanel';
import { useSyncedGlobes } from './hooks/useSyncedGlobes';
import {
  diversityIndices,
  earthModels,
  environmentalParameters,
  FIRST_YEAR,
  LAST_YEAR,
  CONTROL_PANEL_TUTORIAL_STEP,
  LOCK_TUTORIAL_STEP,
  planktonGroups,
  rcpScenarios,
} from './constants';
import {
  APP_SUBTITLE,
  APP_TITLE,
  infoMessages,
  infoMessagesShort,
  noInformationText,
  projectDescription,
  shortProjectDescription,
} from './content';
import {
  headerButtonSx,
  inlineIconButtonSx,
  lockHighlightSx,
  tutorialHighlightSx,
} from './styles/panels';
import './App.css';

// Loaded on demand so Plotly lands in its own chunk instead of the main bundle.
const CombinedLinePlot = lazy(() => import('./components/CombinedLinePlot'));

const INITIAL_PANEL = {
  year: 2026,
  source: 'plankton',
  view: 'map',
  diversity: diversityIndices[1],
  envParam: environmentalParameters[0],
  group: planktonGroups[0],
  rcp: rcpScenarios[0],
  model: earthModels[0],
};

const dividerSx = { bgcolor: 'rgba(255,255,255,0.3)' };

/** Below this width the three columns stack. */
const STACKED = '@media (max-width: 1500px)';

// Stacked, the basis would apply to height; each column then takes its content's.
const columnSx = (basis, grow) => ({ flex: `${grow} 1 ${basis}`, minWidth: 0, [STACKED]: { flexBasis: 'auto' } });

/** The data panels get the larger share of the width; the controls need less. */
const dataColumnSx = columnSx('560px', 1.3);
const controlColumnSx = columnSx('460px', 1);

/**
 * Left control panel | locks | right control panel. The panels and the lock
 * column are subgrids spanning the same rows, so each lock sits level with the
 * row it links. On narrow screens the right panel moves below the left one.
 */
const controlGridSx = {
  display: 'grid',
  gridTemplateColumns: { xs: 'minmax(0, 1fr) auto', sm: 'minmax(0, 1fr) auto minmax(0, 1fr)' },
  columnGap: 1,
  rowGap: 1.5,
  px: 1.5,
  py: 2,
};

const lockColumnSx = {
  gridColumn: 2,
  gridRow: `1 / span ${CONTROL_ROWS.length}`,
  display: 'grid',
  gridTemplateRows: 'subgrid',
  alignItems: 'center',
  px: 0.5,
  borderInline: '1px solid rgba(255,255,255,0.08)',
};

/** Biomes only exist for one group, the plain scenarios and the model mean. */
const filterBiomes = (diversity) => ({
  groups: diversity === 'Biomes' ? planktonGroups.slice(0, 1) : planktonGroups,
  rcp: diversity === 'Biomes' ? rcpScenarios.slice(0, 3) : rcpScenarios,
  models: diversity === 'Biomes' ? earthModels.slice(0, 1) : earthModels,
});

/** Lock that links one setting of the two panels. */
const LockButton = ({ locked, onToggle, what, highlight }) => (
  <Tooltip title={locked ? `Unlink ${what} of the two panels` : `Link ${what} of the two panels`} arrow>
    <IconButton
      size="small"
      aria-label={locked ? `Unlock ${what}` : `Lock ${what}`}
      onClick={onToggle}
      sx={{ ...inlineIconButtonSx, ...(highlight && lockHighlightSx) }}
    >
      {locked ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
    </IconButton>
  </Tooltip>
);

const App = () => {
  // Tutorial state
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Modals. Info text is kept after closing, so it does not blank while the dialog fades out.
  const [infoModal, setInfoModal] = useState({ open: false });
  const [projectModalOpen, setProjectModalOpen] = useState(
    () => !localStorage.getItem(HIDE_WELCOME_KEY)
  );

  const [selectedPoint, setSelectedPoint] = useState({ x: 0, y: 0 });
  const [area, setArea] = useState(null);
  const [sharedZoom, setSharedZoom] = useState(null);

  // Keeps the cameras of the two panels' globes in step.
  const registerGlobe = useSyncedGlobes();

  // Panel states
  const [panel1, setPanel1] = useState(INITIAL_PANEL);
  const [panel2, setPanel2] = useState({ ...INITIAL_PANEL, source: 'environmental', view: 'globe' });

  // Locks
  const [lockScenario, setLockScenario] = useState(true);
  const [lockModel, setLockModel] = useState(true);
  const [lockYear, setLockYear] = useState(true);

  const openInfoModal = (title, key) =>
    setInfoModal({
      open: true,
      title,
      shortText: infoMessagesShort[key] ?? 'No short description available',
      longText: infoMessages[key] ?? noInformationText,
    });

  /** Sets `field` on one panel, and on the other too while `locked`. */
  const linkedSetter = (field, locked) => (panelSetter, otherPanelSetter, value) => {
    panelSetter((prev) => ({ ...prev, [field]: value }));
    if (locked) otherPanelSetter((prev) => ({ ...prev, [field]: value }));
  };

  const handleRcpChange = linkedSetter('rcp', lockScenario);
  const handleModelChange = linkedSetter('model', lockModel);
  const handleYearChange = linkedSetter('year', lockYear);

  /** Toggles a lock; locking copies the left panel's value to the right one. */
  const toggleLock = (locked, setLocked, field) => () => {
    setLocked(!locked);
    if (!locked) setPanel2((prev) => ({ ...prev, [field]: panel1[field] }));
  };

  const lockStep = tutorialStep === LOCK_TUTORIAL_STEP;

  const controlPanelProps = (panel, setPanel, otherSetPanel) => {
    const filtered = filterBiomes(panel.diversity);
    return {
      source: panel.source,
      onSourceChange: (e) => setPanel((prev) => ({ ...prev, source: e.target.value })),
      diversity: panel.diversity,
      onDiversityChange: (e) => setPanel((prev) => ({ ...prev, diversity: e.target.value })),
      envParam: panel.envParam,
      onEnvParamChange: (e) => setPanel((prev) => ({ ...prev, envParam: e.target.value })),
      group: panel.group,
      onGroupChange: (e) => setPanel((prev) => ({ ...prev, group: e.target.value })),
      rcp: panel.rcp,
      onRcpChange: (e) => handleRcpChange(setPanel, otherSetPanel, e.target.value),
      model: panel.model,
      onModelChange: (e) => handleModelChange(setPanel, otherSetPanel, e.target.value),
      filteredGroups: filtered.groups,
      filteredScenarios: filtered.rcp,
      filteredModels: filtered.models,
      diversityIndices,
      environmentalParameters,
      openInfoModal,
    };
  };

  const dataPanelProps = {
    setSelectedPoint,
    setArea,
    selectedPoint,
    selectedArea: area,
    lockYear,
    onLockToggle: toggleLock(lockYear, setLockYear, 'year'),
    highlightLock: lockStep,
    sharedZoom,
    onSharedZoomChange: setSharedZoom,
    registerGlobe,
  };

  const panelSettings = (panel) => ({
    source: panel.source,
    index: panel.diversity,
    group: panel.group,
    scenario: panel.rcp,
    model: panel.model,
    envParam: panel.envParam,
  });

  return (
    <Box className="App" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Tutorial
        start={tutorialActive}
        onFinish={() => {
          setTutorialActive(false);
          setTutorialStep(0);
        }}
        panel1Year={panel1.year}
        setTutorialStep={setTutorialStep}
      />

      <InfoModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        title={`Welcome to ${APP_TITLE}!`}
        shortText={shortProjectDescription}
        longText={projectDescription}
        buttonText="Get Started"
        showDontShowAgain
      />

      <InfoModal
        open={infoModal.open}
        onClose={() => setInfoModal((prev) => ({ ...prev, open: false }))}
        title={infoModal.title}
        shortText={infoModal.shortText}
        longText={infoModal.longText}
      />

      <Box
        component="header"
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mt: 2,
          px: 2,
          textAlign: 'center',
        }}
      >
        <Box sx={{ position: { md: 'absolute' }, left: 16, top: '50%', transform: { md: 'translateY(-50%)' } }}>
          <Button variant="outlined" onClick={() => setTutorialActive(true)} sx={headerButtonSx}>
            Start Tutorial
          </Button>
        </Box>

        <Box sx={{ order: { xs: -1, md: 0 }, width: { xs: '100%', md: 'auto' } }}>
          <Typography variant="h1" sx={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'white', lineHeight: 1.1 }}>
            {APP_TITLE}
          </Typography>
          <Typography variant="h6" sx={{ fontSize: '1.25rem', color: 'white', mt: 0.5 }}>
            {APP_SUBTITLE}
          </Typography>
        </Box>

        <Box sx={{ position: { md: 'absolute' }, right: 16, top: '50%', transform: { md: 'translateY(-50%)' } }}>
          <ReferencesButton />
        </Box>
      </Box>

      <Divider sx={{ ...dividerSx, mt: 1, mb: 2 }} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1.5,
          px: 1.5,
          [STACKED]: { flexDirection: 'column' },
        }}
      >
        <Box sx={dataColumnSx}>
          <DataPanel
            {...dataPanelProps}
            panel={panel1}
            setPanel={setPanel1}
            tutorialStep={tutorialStep}
            onYearChange={(y) => handleYearChange(setPanel1, setPanel2, y)}
          />
        </Box>

        <Box sx={{ ...controlColumnSx, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <CollapsiblePanel
            title="Control Panels"
            sx={{
              ...tutorialHighlightSx([4, LOCK_TUTORIAL_STEP].includes(tutorialStep)),
              // The card's blur makes it a stacking context, which would keep a highlighted
              // control panel inside it under the tutorial overlay.
              ...(tutorialStep === CONTROL_PANEL_TUTORIAL_STEP && { backdropFilter: 'none' }),
            }}
          >
            <Box sx={controlGridSx}>
              <ControlPanel
                {...controlPanelProps(panel1, setPanel1, setPanel2)}
                tutorialStep={tutorialStep}
                sx={{ gridColumn: 1, gridRow: `1 / span ${CONTROL_ROWS.length}` }}
              />

              <Box sx={lockColumnSx}>
                <Box sx={{ gridRow: CONTROL_ROWS.indexOf('scenario') + 1, justifySelf: 'center' }}>
                  <LockButton
                    what="scenario"
                    locked={lockScenario}
                    onToggle={toggleLock(lockScenario, setLockScenario, 'rcp')}
                    highlight={lockStep}
                  />
                </Box>
                <Box sx={{ gridRow: CONTROL_ROWS.indexOf('model') + 1, justifySelf: 'center' }}>
                  <LockButton
                    what="model"
                    locked={lockModel}
                    onToggle={toggleLock(lockModel, setLockModel, 'model')}
                    highlight={lockStep}
                  />
                </Box>
              </Box>

              <ControlPanel
                {...controlPanelProps(panel2, setPanel2, setPanel1)}
                tutorialStep={tutorialStep === CONTROL_PANEL_TUTORIAL_STEP ? null : tutorialStep}
                sx={{
                  gridColumn: { xs: 1, sm: 3 },
                  gridRow: {
                    xs: `${CONTROL_ROWS.length + 1} / span ${CONTROL_ROWS.length}`,
                    sm: `1 / span ${CONTROL_ROWS.length}`,
                  },
                  mt: { xs: 2, sm: 0 },
                }}
              />
            </Box>
          </CollapsiblePanel>

          <Box sx={{ borderRadius: 1, ...tutorialHighlightSx(tutorialStep === 8) }}>
            <Suspense fallback={<LoadingFallback height={450} />}>
              <CombinedLinePlot
                point={selectedPoint}
                zoomedArea={area}
                leftSettings={panelSettings(panel1)}
                rightSettings={panelSettings(panel2)}
                startYear={FIRST_YEAR}
                endYear={LAST_YEAR}
              />
            </Suspense>
          </Box>
        </Box>

        <Box sx={dataColumnSx}>
          <DataPanel
            {...dataPanelProps}
            panel={panel2}
            setPanel={setPanel2}
            tutorialStep={tutorialStep === 1 ? 1 : null}
            onYearChange={(y) => handleYearChange(setPanel2, setPanel1, y)}
          />
        </Box>
      </Box>

      <Divider sx={{ ...dividerSx, my: 2 }} />

      <Footer />
    </Box>
  );
};

export default App;
