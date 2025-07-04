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
  labelColumn,
  inputColumn,
  iconColumn,
}) => (
  <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
    <Box sx={labelColumn}>
      <IconButton onClick={() => openInfoModal(infoText)} size="small" sx={{ color: 'white', p: 0 }}>
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>
      <Typography color="white" sx={{ mr: 0.5 }}>
        {label}
      </Typography>
    </Box>
    <Box sx={inputColumn}>
      <FormControl variant="outlined" size="small" fullWidth sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}>
        <Select id={id} value={value} onChange={onChange}>
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
    <Box sx={iconColumn}>
      <IconButton onClick={() => openInfoModal(value)} size="small" sx={{ color: 'white', p: 0 }}>
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>
    </Box>
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
  labelColumn,
  inputColumn,
  iconColumn,
  diversityIndices,
  environmentalParameters,
}) => (
  <Box className="panel-controls" sx={{ mt: 1, minHeight: 200 }}>

    {/* Data Source Row */}
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
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
      label="Scenario:"
      id="rcp"
      value={rcp}
      options={filteredScenarios}
      onChange={onRcpChange}
      infoText="RCP Scenarios general"
      openInfoModal={openInfoModal}
      labelColumn={labelColumn}
      inputColumn={inputColumn}
      iconColumn={iconColumn}
    />

    {/* Model */}
    <LabeledSelect
      label="Model:"
      id="model"
      value={model}
      options={filteredModels}
      onChange={onModelChange}
      infoText="Earth System Models general"
      openInfoModal={openInfoModal}
      labelColumn={labelColumn}
      inputColumn={inputColumn}
      iconColumn={iconColumn}
    />

    {/* Metric */}
    <LabeledSelect
      label={'Metric:'}
      id={source === 'plankton' ? 'diversity' : 'env-param'}
      value={source === 'plankton' ? diversity : envParam}
      options={source === 'plankton' ? diversityIndices : environmentalParameters}
      onChange={source === 'plankton' ? onDiversityChange : onEnvParamChange}
      infoText={source === 'plankton' ? 'Diversity Indices general' : 'Environmental Parameters general'}
      openInfoModal={openInfoModal}
      labelColumn={labelColumn}
      inputColumn={inputColumn}
      iconColumn={iconColumn}
    />

    {/* Group (Plankton only) */}
    {source === 'plankton' && (
      <LabeledSelect
        label="Group:"
        id="group"
        value={group}
        options={filteredGroups}
        onChange={onGroupChange}
        infoText="Plankton Groups general"
        openInfoModal={openInfoModal}
        labelColumn={labelColumn}
        inputColumn={inputColumn}
        iconColumn={iconColumn}
      />
    )}
  </Box>
);

export default ControlPanel;