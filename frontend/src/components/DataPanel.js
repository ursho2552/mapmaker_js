import React, { lazy, Suspense } from 'react';
import {
    Box,
    Typography,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Slider as MuiSlider,
} from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import LoadingFallback from './LoadingFallback';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { lockHighlightSx } from '../constants';

// Loaded on demand so three.js (globe) and Plotly (map) get their own chunks.
const GlobeDisplay = lazy(() => import('./GlobeDisplay'));
const MapDisplay = lazy(() => import('./MapDisplay'));

// The slider updates the label at once, but data is only requested once it rests.
const YEAR_DEBOUNCE_MS = 300;

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
    onSharedZoomChange
}) => {
    const dataYear = useDebouncedValue(panel.year, YEAR_DEBOUNCE_MS);
    const highlighted = [1, 2, 3, 7].includes(tutorialStep) || highlightLock;

    return (
        <Box
            sx={{
                p: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                borderRadius: 1,
                display: 'flex',
                flexDirection: 'column',
                border: highlighted ? '4px solid #4FC3F7' : 'none',
                boxShadow: highlighted
                    ? '0 0 30px 10px rgba(79,195,247,0.6)'
                    : 'none',
                animation: highlighted ? 'pulse 1.5s infinite' : 'none',
                position: 'relative',
                zIndex: highlighted ? 3000 : 'auto',
            }}
        >
            {/* View Switch */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <FormControl component="fieldset">
                    <RadioGroup
                        row
                        value={panel.view}
                        onChange={(e) => setPanel({ ...panel, view: e.target.value })}
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

            {/* Year Slider */}
            <Box sx={{ mb: 1, px: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                    <Typography color="white" variant="subtitle">
                        Year: {panel.year}
                    </Typography>
                    <Box
                        sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            color: 'white',
                            '&:hover': { color: '#1976d2' },
                            ...(highlightLock && lockHighlightSx),
                        }}
                        onClick={() => onLockToggle && onLockToggle()}
                    >
                        {lockYear ? <Lock /> : <LockOpen />}
                    </Box>
                </Box>
                <MuiSlider
                    min={2012}
                    max={2100}
                    value={panel.year}
                    onChange={(e, v) => {
                        setPanel(prev => ({ ...prev, year: v }));
                        if (onYearChange) onYearChange(v);
                    }}
                    valueLabelDisplay="auto"
                    sx={{ color: '#1976d2' }}
                />
            </Box>

            {/* Display Map or Globe */}
            <Box sx={{ width: '100%', height: 400, position: 'relative' }}>
                <Suspense fallback={<LoadingFallback />}>
                {panel.source === 'plankton' && panel.view === 'map' && (
                    <MapDisplay
                        year={dataYear}
                        index={panel.diversity}
                        group={panel.group}
                        scenario={panel.rcp}
                        model={panel.model}
                        sourceType="plankton"
                        onPointClick={(x, y) => setSelectedPoint({ x, y })}
                        selectedPoint={selectedPoint}
                        selectedArea={selectedArea}
                        onZoomedAreaChange={(area) => {
                            setArea(area);
                            onSharedZoomChange?.(area);
                        }}
                        zoomedArea={sharedZoom}
                    />
                )}
                {panel.source === 'plankton' && panel.view === 'globe' && (
                    <GlobeDisplay
                        year={dataYear}
                        index={panel.diversity}
                        group={panel.group}
                        scenario={panel.rcp}
                        model={panel.model}
                        sourceType="plankton"
                        onPointClick={(x, y) => setSelectedPoint({ x, y })}
                        selectedPoint={selectedPoint}
                    />
                )}
                {panel.source === 'environmental' && panel.view === 'map' && (
                    <MapDisplay
                        year={dataYear}
                        index={panel.envParam}
                        scenario={panel.rcp}
                        model={panel.model}
                        sourceType="environmental"
                        onPointClick={(x, y) => setSelectedPoint({ x, y })}
                        selectedPoint={selectedPoint}
                        selectedArea={selectedArea}
                        onZoomedAreaChange={(area) => {
                            setArea(area);
                            onSharedZoomChange?.(area);
                        }}
                        zoomedArea={sharedZoom}
                    />
                )}
                {panel.source === 'environmental' && panel.view === 'globe' && (
                    <GlobeDisplay
                        year={dataYear}
                        index={panel.envParam}
                        scenario={panel.rcp}
                        model={panel.model}
                        sourceType="environmental"
                        onPointClick={(x, y) => setSelectedPoint({ x, y })}
                        selectedPoint={selectedPoint}
                    />
                )}
                </Suspense>
            </Box>
        </Box>
    );
};

export default DataPanel;
