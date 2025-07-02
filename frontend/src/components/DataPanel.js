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
import ControlPanel from './ControlPanel';

const DataPanel = ({
    panel,
    setPanel,
    debouncedYear,
    debouncedUpdateYear,
    filterBiomes,
    diversityIndices,
    environmentalParameters,
    openInfoModal,
    LABEL_COLUMN,
    INPUT_COLUMN,
    ICON_COLUMN,
    setSelectedPoint,
}) => {
    return (
        <Box sx={{ flex: 1, minWidth: 300, p: 2, backgroundColor: 'black', borderRadius: 1 }}>
            <ControlPanel
                source={panel.source}
                onSourceChange={(e) => setPanel({ ...panel, source: e.target.value })}
                diversity={panel.diversity}
                onDiversityChange={(e) => setPanel({ ...panel, diversity: e.target.value })}
                envParam={panel.envParam}
                onEnvParamChange={(e) => setPanel({ ...panel, envParam: e.target.value })}
                group={panel.group}
                onGroupChange={(e) => setPanel({ ...panel, group: e.target.value })}
                rcp={panel.rcp}
                onRcpChange={(e) => setPanel({ ...panel, rcp: e.target.value })}
                model={panel.model}
                onModelChange={(e) => setPanel({ ...panel, model: e.target.value })}
                filteredGroups={filterBiomes(panel.diversity).groups}
                filteredScenarios={filterBiomes(panel.diversity).rcp}
                filteredModels={filterBiomes(panel.diversity).models}
                diversityIndices={diversityIndices}
                environmentalParameters={environmentalParameters}
                openInfoModal={openInfoModal}
                labelColumn={LABEL_COLUMN}
                inputColumn={INPUT_COLUMN}
                iconColumn={ICON_COLUMN}
            />

            {/* View Switch */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
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
            <Box sx={{ mb: 2, px: 1 }}>
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
                        year={debouncedYear}
                        index={panel.diversity}
                        group={panel.group}
                        scenario={panel.rcp}
                        model={panel.model}
                        sourceType="plankton"
                        onPointClick={(x, y) => setSelectedPoint({ x, y })}
                    />
                )}
                {panel.source === 'plankton' && panel.view === 'globe' && (
                    <GlobeDisplay
                        year={debouncedYear}
                        index={panel.diversity}
                        group={panel.group}
                        scenario={panel.rcp}
                        model={panel.model}
                        sourceType="plankton"
                        onPointClick={(x, y) => setSelectedPoint({ x, y })}
                    />
                )}
                {panel.source === 'environmental' && panel.view === 'map' && (
                    <MapDisplay
                        year={debouncedYear}
                        index={panel.envParam}
                        scenario={panel.rcp}
                        model={panel.model}
                        sourceType="environmental"
                        onPointClick={(x, y) => setSelectedPoint({ x, y })}
                    />
                )}
                {panel.source === 'environmental' && panel.view === 'globe' && (
                    <GlobeDisplay
                        year={debouncedYear}
                        index={panel.envParam}
                        scenario={panel.rcp}
                        model={panel.model}
                        sourceType="environmental"
                        onPointClick={(x, y) => setSelectedPoint({ x, y })}
                    />
                )}
            </Box>
        </Box>
    );
};

export default DataPanel;
