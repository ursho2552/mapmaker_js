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

const LabeledSelect = ({
  label,
  id,
  value,
  options,
  onChange,
  infoText,
  openInfoModal,
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'row', mb: 1, gap: 1 }}>
    <FormControl
      variant="outlined"
      size="small"
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(12px)',
        borderRadius: 2,
        flex: 1,
        maxWidth: 220,
        mr: 0.5,
        border: '1px solid rgba(255, 255, 255, 0.25)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        '& .MuiInputBase-input': {
          color: '#FFFFFF',
        },
        '& .MuiSvgIcon-root': {
          color: '#FFFFFF',
        },
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
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                },
              },
            },
          },
        }}
      >
        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <IconButton
      onClick={() => openInfoModal(label, infoText)}
      size="small"
      sx={{ color: 'white', p: 0, m: 0 }}
    >
      <InfoOutlinedIcon fontSize="small" />
    </IconButton>
  </Box>
);

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
}) => (
  <Box
    sx={{
      px: 2,
      py: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
      backdropFilter: 'blur(8px)',
      borderRadius: 1,
      border: [6].includes(tutorialStep) ? '4px solid #4FC3F7' : 'none',
      boxShadow: [6].includes(tutorialStep)
        ? '0 0 30px 10px rgba(79,195,247,0.6)'
        : 'none',
      animation: [6].includes(tutorialStep) ? 'pulse 1.5s infinite' : 'none',
      position: 'relative',
      zIndex: [6].includes(tutorialStep) ? 3000 : 'auto',
    }}
  >
    {/* Data Source Row */}
    <Box sx={{ alignItems: 'center', mb: 1 }}>
      <FormControl component="fieldset" sx={{ color: 'white' }}>
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
    </Box>

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
      label={'Metric'}
      id={source === 'plankton' ? 'diversity' : 'env-param'}
      value={source === 'plankton' ? diversity : envParam}
      options={source === 'plankton' ? diversityIndices : environmentalParameters}
      onChange={source === 'plankton' ? onDiversityChange : onEnvParamChange}
      infoText={source === 'plankton' ? 'Diversity Indices general' : 'Environmental Parameters general'}
      openInfoModal={openInfoModal}
    />

    {/* Group (Plankton only) */}
    {source === 'plankton' && (
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

export default ControlPanel;
