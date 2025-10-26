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
import GlobeDisplay from './GlobeDisplay';
import MapDisplay from './MapDisplay';

const DataPanel = ({
    panel,
    setPanel,
    debouncedUpdateYear,
    setSelectedPoint,
    selectedPoint,
}) => {
    return (
        <Box sx={{
            p: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 1,
            flex: 1,
            width: 500,
            display: 'flex',
            flexDirection: 'column',
        }}>
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
                <Typography color="white" variant="subtitle2" gutterBottom>
                    Year: {panel.year}
                </Typography>
                <MuiSlider
                    min={2012}
                    max={2100}
                    value={panel.year}
                    onChange={(e, v) => {
                        setPanel((prev) => ({ ...prev, year: v }));
                        debouncedUpdateYear(v);
                    }}
                    valueLabelDisplay="auto"
                    sx={{ color: '#1976d2' }}
                />
            </Box>

            {/* Display Map or Globe */}
            <Box sx={{ width: '100%', height: 400, position: 'relative' }}>
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
