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
        backgroundColor: 'white',
        borderRadius: 1,
        width: 220,
        mr: 0.5,
      }}
    >
      <Select
        id={id}
        value={value}
        onChange={onChange}
        startAdornment={
          <IconButton onClick={() => openInfoModal(value, value)} size="small">
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        }
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
}) => (
  <Box sx={{
    px: 2,
    py: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 1,
  }}>
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