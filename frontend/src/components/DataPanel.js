import React from 'react';
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
import GlobeDisplay from './GlobeDisplay';
import MapDisplay from './MapDisplay';

const DataPanel = ({
    panel,
    setPanel,
    tutorialStep,
    debouncedUpdateYear,
    setSelectedPoint,
    selectedPoint,
    lockYear,
    onYearChange,
    onLockToggle,
}) => {
    const isHighlighted = [1, 2, 3, 7].includes(tutorialStep);

    return (
        <Box className={`data-panel ${isHighlighted ? 'highlight' : ''}`}>
            {/* View Switch */}
            <Box className="view-switch">
                <FormControl component="fieldset">
                    <RadioGroup
                        row
                        value={panel.view}
                        onChange={(e) => setPanel({ ...panel, view: e.target.value })}
                    >
                        <FormControlLabel
                            value="map"
                            control={<Radio className="radio-white" />}
                            label={<Typography className="radio-label">Map</Typography>}
                        />
                        <FormControlLabel
                            value="globe"
                            control={<Radio className="radio-white" />}
                            label={<Typography className="radio-label">Globe</Typography>}
                        />
                    </RadioGroup>
                </FormControl>
            </Box>

            {/* Year Slider */}
            <Box className="year-slider">
                <Box className="year-slider-header">
                    <Typography color="white" variant="subtitle2">
                        Year: {panel.year}
                    </Typography>
                    <Box className="lock-icon" onClick={onLockToggle}>
                        {lockYear ? <Lock /> : <LockOpen />}
                    </Box>
                </Box>
                <MuiSlider
                    min={2012}
                    max={2100}
                    value={panel.year}
                    onChange={(e, v) => {
                        setPanel(prev => ({ ...prev, year: v }));
                        debouncedUpdateYear(v);
                        onYearChange?.(v);
                    }}
                    valueLabelDisplay="auto"
                    className="slider"
                />
            </Box>

            {/* Display Map or Globe */}
            <Box className="display-container">
                {panel.source === 'plankton' && panel.view === 'map' && (
                    <MapDisplay
                        year={panel.year}
                        index={panel.diversity}
                        group={panel.group}
                        scenario={panel.rcp}
                        model={panel.model}
                        sourceType="plankton"
                        onPointClick={(x, y) => setSelectedPoint({ x, y })}
                        selectedPoint={selectedPoint}
                    />
                )}
                {panel.source === 'plankton' && panel.view === 'globe' && (
                    <GlobeDisplay
                        year={panel.year}
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
                        year={panel.year}
                        index={panel.envParam}
                        scenario={panel.rcp}
                        model={panel.model}
                        sourceType="environmental"
                        onPointClick={(x, y) => setSelectedPoint({ x, y })}
                        selectedPoint={selectedPoint}
                    />
                )}
                {panel.source === 'environmental' && panel.view === 'globe' && (
                    <GlobeDisplay
                        year={panel.year}
                        index={panel.envParam}
                        scenario={panel.rcp}
                        model={panel.model}
                        sourceType="environmental"
                        onPointClick={(x, y) => setSelectedPoint({ x, y })}
                        selectedPoint={selectedPoint}
                    />
                )}
            </Box>
        </Box>
    );
};

export default DataPanel;