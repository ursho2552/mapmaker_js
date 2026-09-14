import React from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  darkMenuProps,
  glassSelectSx,
  inlineIconButtonSx,
  tutorialHighlightSx,
} from '../styles/panels';
import { CONTROL_PANEL_TUTORIAL_STEP } from '../constants';

const radioSx = { color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: '#fff' }, py: 0.5 };

/**
 * Explains the selected option. Acts on mousedown without taking focus, since it
 * sits inside the Select, which would otherwise open its menu on the same click.
 */
const OptionInfoButton = ({ onOpen }) => (
  <IconButton
    size="small"
    tabIndex={-1}
    aria-label="About the selected option"
    sx={{ ...inlineIconButtonSx, mr: 0.5 }}
    onMouseDown={(e) => {
      e.stopPropagation();
      e.preventDefault();
      onOpen();
    }}
  >
    <InfoOutlinedIcon fontSize="small" />
  </IconButton>
);

const LabeledSelect = ({ label, id, value, options, onChange, infoText, openInfoModal }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <FormControl size="small" sx={{ ...glassSelectSx, flex: 1, minWidth: 0 }}>
      <Select
        id={id}
        value={value}
        onChange={onChange}
        inputProps={{ 'aria-label': label }}
        startAdornment={<OptionInfoButton onOpen={() => openInfoModal(value, value)} />}
        MenuProps={darkMenuProps}
      >
        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <Tooltip title={`About ${label.toLowerCase()}s`} placement="top" arrow>
      <IconButton
        size="small"
        aria-label={`About ${label.toLowerCase()}s`}
        onClick={() => openInfoModal(label, infoText)}
        sx={inlineIconButtonSx}
      >
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Box>
);

/** Rows of a control panel, in order, so a neighbouring column can line up with them. */
export const CONTROL_ROWS = ['source', 'scenario', 'model', 'metric', 'group'];

/**
 * Source, scenario, model, metric and group of one data panel. Its rows form a
 * subgrid of the parent grid, so a column beside it (the locks) shares the row heights.
 */
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
  sx = {},
}) => {
  const isPlankton = source === 'plankton';

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'subgrid',
        // Without it the column sizes to the widest select and overflows its track.
        gridTemplateColumns: 'minmax(0, 1fr)',
        gridRow: `span ${CONTROL_ROWS.length}`,
        alignItems: 'center',
        minWidth: 0,
        borderRadius: 1,
        // Highlighted a little way out: padding would resize the rows this subgrid shares with the lock icons.
        ...tutorialHighlightSx(tutorialStep === CONTROL_PANEL_TUTORIAL_STEP, 10),
        ...sx,
      }}
    >
      <RadioGroup name="source" value={source} onChange={onSourceChange}>
        {[
          ['plankton', 'Plankton Diversity'],
          ['environmental', 'Environmental Conditions'],
        ].map(([value, label]) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio size="small" sx={radioSx} />}
            label={<Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>{label}</Typography>}
          />
        ))}
      </RadioGroup>

      <LabeledSelect
        label="Scenario"
        id="rcp"
        value={rcp}
        options={filteredScenarios}
        onChange={onRcpChange}
        infoText="RCP Scenarios general"
        openInfoModal={openInfoModal}
      />

      <LabeledSelect
        label="Model"
        id="model"
        value={model}
        options={filteredModels}
        onChange={onModelChange}
        infoText="Earth System Models general"
        openInfoModal={openInfoModal}
      />

      <LabeledSelect
        label="Metric"
        id={isPlankton ? 'diversity' : 'env-param'}
        value={isPlankton ? diversity : envParam}
        options={isPlankton ? diversityIndices : environmentalParameters}
        onChange={isPlankton ? onDiversityChange : onEnvParamChange}
        infoText={isPlankton ? 'Diversity Indices general' : 'Environmental Parameters general'}
        openInfoModal={openInfoModal}
      />

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
