import React, { lazy, Suspense, useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import { Lock, LockOpen, Map as MapIcon, Public as PublicIcon } from '@mui/icons-material';
import LoadingFallback from './LoadingFallback';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { FIRST_YEAR, LAST_YEAR } from '../constants';
import {
  glassPanelSx,
  inlineIconButtonSx,
  lockHighlightSx,
  tutorialHighlightSx,
  viewToggleSx,
} from '../styles/panels';
import { aspectBoxStyle } from '../styles/display';

// Loaded on demand so three.js (globe) and Plotly (map) get their own chunks.
const GlobeDisplay = lazy(() => import('./GlobeDisplay'));
const MapDisplay = lazy(() => import('./MapDisplay'));

// The slider commits on release, but keyboard steps commit one by one; data is
// only requested once the year has rested.
const YEAR_DEBOUNCE_MS = 300;

const YEAR_MARKS = [FIRST_YEAR, 2030, 2050, 2070, LAST_YEAR].map((value) => ({
  value,
  label: String(value),
}));

const sliderSx = {
  color: '#fff',
  '& .MuiSlider-markLabel': { color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' },
  '& .MuiSlider-valueLabel': { backgroundColor: 'rgba(30,30,30,0.9)' },
};

/** Year slider: local state keeps dragging fluid, the committed value drives the figures. */
const YearControl = ({ year, onYearChange, lockYear, onLockToggle, highlightLock }) => {
  const [draftYear, setDraftYear] = useState(year);
  useEffect(() => setDraftYear(year), [year]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 220 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
        <Typography sx={{ color: 'white', minWidth: 80 }}>Year: {draftYear}</Typography>
        <Tooltip title={lockYear ? 'Unlink year from the other panel' : 'Link year to the other panel'} arrow>
          <IconButton
            size="small"
            aria-label={lockYear ? 'Unlock year' : 'Lock year'}
            onClick={onLockToggle}
            sx={{ ...inlineIconButtonSx, ...(highlightLock && lockHighlightSx) }}
          >
            {lockYear ? <Lock fontSize="small" /> : <LockOpen fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      <Slider
        min={FIRST_YEAR}
        max={LAST_YEAR}
        value={draftYear}
        marks={YEAR_MARKS}
        valueLabelDisplay="auto"
        onChange={(_, value) => setDraftYear(value)}
        onChangeCommitted={(_, value) => onYearChange?.(value)}
        sx={{ ...sliderSx, flex: 1, mx: 1, mb: 1.5 }}
      />
    </Box>
  );
};

const DataPanel = ({
  panel,
  setPanel,
  tutorialStep,
  setSelectedPoint,
  setArea,
  selectedPoint,
  selectedArea,
  lockYear,
  onYearChange,
  onLockToggle,
  highlightLock,
  sharedZoom,
  onSharedZoomChange,
  registerGlobe,
}) => {
  const dataYear = useDebouncedValue(panel.year, YEAR_DEBOUNCE_MS);
  const highlighted = [1, 2, 3, 7].includes(tutorialStep) || highlightLock;
  const isPlankton = panel.source === 'plankton';

  const displayProps = {
    year: dataYear,
    index: isPlankton ? panel.diversity : panel.envParam,
    group: isPlankton ? panel.group : undefined,
    scenario: panel.rcp,
    model: panel.model,
    sourceType: panel.source,
    onPointClick: (x, y) => setSelectedPoint({ x, y }),
    selectedPoint,
  };

  return (
    <Box
      sx={{
        ...glassPanelSx,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        ...tutorialHighlightSx(highlighted),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <YearControl
          year={panel.year}
          onYearChange={onYearChange}
          lockYear={lockYear}
          onLockToggle={onLockToggle}
          highlightLock={highlightLock}
        />

        <ToggleButtonGroup
          value={panel.view}
          exclusive
          size="small"
          onChange={(_, view) => view && setPanel((prev) => ({ ...prev, view }))}
          sx={{ ...viewToggleSx, ml: 'auto' }}
        >
          <ToggleButton value="map">
            <MapIcon sx={{ fontSize: 16, mr: 0.5 }} />
            Map
          </ToggleButton>
          <ToggleButton value="globe">
            <PublicIcon sx={{ fontSize: 16, mr: 0.5 }} />
            Globe
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Suspense
        fallback={
          <div style={aspectBoxStyle}>
            <LoadingFallback sx={{ position: 'absolute', inset: 0 }} />
          </div>
        }
      >
        {panel.view === 'map' ? (
          <MapDisplay
            {...displayProps}
            selectedArea={selectedArea}
            onZoomedAreaChange={(area) => {
              setArea(area);
              onSharedZoomChange?.(area);
            }}
            zoomedArea={sharedZoom}
          />
        ) : (
          <GlobeDisplay {...displayProps} registerGlobe={registerGlobe} />
        )}
      </Suspense>
    </Box>
  );
};

export default DataPanel;
