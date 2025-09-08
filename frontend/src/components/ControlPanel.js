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
  <Box className="labeled-select">
    <FormControl
      variant="outlined"
      size="small"
      className="labeled-select-control"
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
            className: "labeled-select-menu-paper",
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
  <Box className={`control-panel ${tutorialStep === 6 ? 'highlight' : ''}`}>
    {/* Data Source Row */}
    <Box sx={{ alignItems: 'center', mb: 1 }}>
      <FormControl component="fieldset" sx={{ color: 'white' }}>
        <RadioGroup row name="source" value={source} onChange={onSourceChange}>
          <FormControlLabel
            value="plankton"
            control={<Radio className="radio-white" />}
            label={<Typography className="radio-label">Plankton Diversity</Typography>}
          />

          <FormControlLabel
            value="environmental"
            control={<Radio className="radio-white" />}
            label={<Typography className="radio-label">Environmental Conditions</Typography>}
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
