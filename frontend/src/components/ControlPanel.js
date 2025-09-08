import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  MenuItem,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Reusable select component with an info button
const LabeledSelect = ({ label, id, value, options, onChange, infoText, openInfoModal }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
    <FormControl
      variant="outlined"
      size="small"
      sx={{
        flex: 1,
        minWidth: 180,
        maxWidth: 220,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(12px)',
        borderRadius: 2,
        border: '1px solid rgba(255, 255, 255, 0.25)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        '& .MuiInputBase-input': { color: '#FFFFFF' },
        '& .MuiSvgIcon-root': { color: '#FFFFFF' },
      }}
    >
      <Select
        id={id}
        value={value}
        onChange={onChange}
        startAdornment={
          <IconButton onClick={() => openInfoModal(value, value)} size="small" sx={{ color: 'white' }}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        }
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
              '& .MuiMenuItem-root': {
                color: '#FFFFFF',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)' },
              },
            },
          },
        }}
      >
        {options.map(opt => (
          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
        ))}
      </Select>
    </FormControl>

    <IconButton onClick={() => openInfoModal(label, infoText)} size="small" sx={{ color: 'white', p: 0 }}>
      <InfoOutlinedIcon fontSize="small" />
    </IconButton>
  </Box>
);

// Control panel for selecting source, scenario, model, metrics, and groups

const ControlPanel = ({
  source,
  onSourceChange,
  diversity,
  onDiversityChange,
  envParam,
  onEnvParamChange,
  group,
  onGroupChange,
  rcp,
  onRcpChange,
  model,
  onModelChange,
  filteredGroups,
  filteredScenarios,
  filteredModels,
  openInfoModal,
  diversityIndices,
  environmentalParameters,
  tutorialStep,
}) => {
  const isPlankton = source === 'plankton';

  const borderStyles = [6].includes(tutorialStep)
    ? { border: '4px solid #4FC3F7', boxShadow: '0 0 30px 10px rgba(79,195,247,0.6)', animation: 'pulse 1.5s infinite', zIndex: 3000 }
    : {};

  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(8px)',
        borderRadius: 1,
        position: 'relative',
        ...borderStyles,
      }}
    >
      {/* Source Selection */}
      <FormControl component="fieldset" sx={{ color: 'white', mb: 1 }}>
        <RadioGroup row name="source" value={source} onChange={onSourceChange}>
          <FormControlLabel
            value="plankton"
            control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />}
            label={<Typography color="white">Plankton Diversity</Typography>}
          />
          <FormControlLabel
            value="environmental"
            control={<Radio sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }} />}
            label={<Typography color="white">Environmental Conditions</Typography>}
          />
        </RadioGroup>
      </FormControl>

      {/* Scenario */}
      <LabeledSelect
        label="Scenario"
        id="rcp"
        value={rcp}
        options={filteredScenarios}
        onChange={onRcpChange}
        infoText="RCP Scenarios general"
        openInfoModal={openInfoModal}
      />

      {/* Model */}
      <LabeledSelect
        label="Model"
        id="model"
        value={model}
        options={filteredModels}
        onChange={onModelChange}
        infoText="Earth System Models general"
        openInfoModal={openInfoModal}
      />

      {/* Metric */}
      <LabeledSelect
        label="Metric"
        id={isPlankton ? 'diversity' : 'env-param'}
        value={isPlankton ? diversity : envParam}
        options={isPlankton ? diversityIndices : environmentalParameters}
        onChange={isPlankton ? onDiversityChange : onEnvParamChange}
        infoText={isPlankton ? 'Diversity Indices general' : 'Environmental Parameters general'}
        openInfoModal={openInfoModal}
      />

      {/* Group (only for plankton) */}
      {isPlankton && (
        <LabeledSelect
          label="Group"
          id="group"
          value={group}
          options={filteredGroups}
          onChange={onGroupChange}
          infoText="Plankton Groups general"
          openInfoModal={openInfoModal}
        />
      )}
    </Box>
  );
};

export default ControlPanel;
