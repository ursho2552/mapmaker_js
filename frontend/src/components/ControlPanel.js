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
    {/* ── DATA SOURCE RADIO ROW ──────────────────────────────────────── */}
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, justifyContent: 'space-between' }}>
      <FormControl component="fieldset" sx={{ color: 'white' }}>
        <RadioGroup row name="source" value={source} onChange={onSourceChange}>
          <FormControlLabel
            value="plankton"
            control={<Radio />}
            label={<Typography color="white">Plankton</Typography>}
          />
          <FormControlLabel
            value="environmental"
            control={<Radio />}
            label={<Typography color="white">Environmental</Typography>}
          />
        </RadioGroup>
      </FormControl>
    </Box>

    {/* ── INDEX / METRIC ROW ─────────────────────────────────────────── */}
    <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
      <Box sx={labelColumn}>
        {source === 'plankton' ? (
          <>
            <IconButton
              onClick={() => openInfoModal('Diversity Indices general')}
              size="small"
              sx={{ color: 'white', p: 0 }}
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
            <Typography color="white" sx={{ mr: 0.5 }}>
              Index:
            </Typography>
          </>
        ) : (
          <Typography color="white">Metric:</Typography>
        )}
      </Box>

      <Box sx={inputColumn}>
        {source === 'plankton' ? (
          <FormControl
            variant="outlined"
            size="small"
            fullWidth
            sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
          >
            <Select id="diversity" value={diversity} onChange={onDiversityChange}>
              {diversityIndices.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <FormControl
            variant="outlined"
            size="small"
            fullWidth
            sx={{ minWidth: 180, backgroundColor: 'white', borderRadius: 1 }}
          >
            <Select id="env-param" value={envParam} onChange={onEnvParamChange}>
              {environmentalParameters.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      <Box sx={iconColumn}>
        {source === 'plankton' && (
          <IconButton
            onClick={() => openInfoModal(diversity)}
            size="small"
            sx={{ color: 'white', p: 0 }}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        )}
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
