/**
 * ControlPanel – generic selector block used by each display panel.
 *
 * Required props
 * ──────────────────────────────────────────────────────────────────────────────
 * source            ("plankton" | "environmental")
 * onSourceChange    (event)        → void
 *
 * diversity         (string)       – selected diversity index
 * onDiversityChange (event)        → void
 *
 * envParam          (string)       – selected environmental parameter
 * onEnvParamChange  (event)        → void
 *
 * group             (string)       – selected plankton group
 * onGroupChange     (event)        → void
 *
 * rcp               (string)       – selected RCP scenario
 * onRcpChange       (event)        → void
 *
 * model             (string)       – selected earth-system model
 * onModelChange     (event)        → void
 *
 * filteredGroups    (string[])     – group options after “Biomes” filtering
 * filteredScenarios (string[])     – scenario options after “Biomes” filtering
 * filteredModels    (string[])     – model options after “Biomes” filtering
 *
 * openInfoModal     (label:string) → void
 *
 * labelColumn       — style object shared from parent
 * inputColumn       — style object shared from parent
 * iconColumn        — style object shared from parent
 */

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

const ControlPanel = ({
  /* mandatory props */
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
  /* shared layout styles */
  labelColumn,
  inputColumn,
  iconColumn,
  /* option arrays (passed via parent to avoid local imports) */
  diversityIndices,
  environmentalParameters,
}) => (
  <Box className="panel-controls" sx={{ mb: 1, minHeight: 300 }}>
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

    <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
      {/* Label and general info */}
      <Box sx={labelColumn}>
        <IconButton
          onClick={() =>
            openInfoModal(
              source === 'plankton'
                ? 'Diversity Indices general'
                : 'Environmental Parameters general'
            )
          }
          size="small"
          sx={{ color: 'white', p: 0 }}
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
        <Typography color="white" sx={{ mr: 0.5 }}>
          {source === 'plankton' ? 'Index:' : 'Metric:'}
        </Typography>
      </Box>

      {/* Dropdown input */}
      <Box sx={inputColumn}>
        <FormControl
          variant="outlined"
          size="small"
          fullWidth
          sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
        >
          <Select
            id={source === 'plankton' ? 'diversity' : 'env-param'}
            value={source === 'plankton' ? diversity : envParam}
            onChange={source === 'plankton' ? onDiversityChange : onEnvParamChange}
          >
            {(source === 'plankton' ? diversityIndices : environmentalParameters).map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Specific info for selected option */}
      <Box sx={iconColumn}>
        <IconButton
          onClick={() => openInfoModal(source === 'plankton' ? diversity : envParam)}
          size="small"
          sx={{ color: 'white', p: 0 }}
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>

    {/* ── GROUP ROW (plankton only) ───────────────────────────────────── */}
    {source === 'plankton' && (
      <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
        <Box sx={labelColumn}>
          <IconButton
            onClick={() => openInfoModal('Plankton Groups general')}
            size="small"
            sx={{ color: 'white', p: 0 }}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
          <Typography color="white" sx={{ mr: 0.5 }}>
            Group:
          </Typography>
        </Box>

        <Box sx={inputColumn}>
          <FormControl
            variant="outlined"
            size="small"
            fullWidth
            sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
          >
            <Select id="group" value={group} onChange={onGroupChange}>
              {filteredGroups.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={iconColumn}>
          <IconButton
            onClick={() => openInfoModal(group)}
            size="small"
            sx={{ color: 'white', p: 0 }}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    )}

    {/* ── Scenario ──────────────────────────────────────────────────── */}
    <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
      <Box sx={labelColumn}>
        <IconButton onClick={() => openInfoModal('RCP Scenarios general')} size="small" sx={{ color: 'white', p: 0 }}>
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
        <Typography color="white" sx={{ mr: 0.5 }}>Scenario:</Typography>
      </Box>
      <Box sx={inputColumn}>
        <FormControl variant="outlined" size="small" fullWidth sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}>
          <Select id="rcp" value={rcp} onChange={onRcpChange}>
            {filteredScenarios.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
      <Box sx={iconColumn}>
        <IconButton onClick={() => openInfoModal(rcp)} size="small" sx={{ color: 'white', p: 0 }}>
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>


    {/* ── Model ──────────────────────────────────────────────────────── */}
    <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
      <Box sx={labelColumn}>
        <IconButton onClick={() => openInfoModal('Earth System Models general')} size="small" sx={{ color: 'white', p: 0 }}>
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
        <Typography color="white" sx={{ mr: 0.5 }}>Model:</Typography>
      </Box>
      <Box sx={inputColumn}>
        <FormControl variant="outlined" size="small" fullWidth sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}>
          <Select id="model" value={model} onChange={onModelChange}>
            {filteredModels.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
      <Box sx={iconColumn}>
        <IconButton onClick={() => openInfoModal(model)} size="small" sx={{ color: 'white', p: 0 }}>
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  </Box>
);

export default ControlPanel;
