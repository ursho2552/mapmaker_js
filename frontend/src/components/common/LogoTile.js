import React from 'react';
import { Box, Paper } from '@mui/material';
import { logoTileSx } from '../../styles/panels';

/** Linked logo plate, as used in the footer. */
const LogoTile = ({ logo, width = 200, height = 70 }) => (
  <Paper
    component="a"
    href={logo.href}
    target="_blank"
    rel="noopener noreferrer"
    elevation={2}
    sx={logoTileSx(width, height)}
  >
    <Box
      component="img"
      src={logo.src}
      alt={logo.alt}
      sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
    />
  </Paper>
);

export default LogoTile;
