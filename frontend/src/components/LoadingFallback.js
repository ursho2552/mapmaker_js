import React from 'react';
import { Box } from '@mui/material';
import Spinner from './common/Spinner';

// Placeholder shown while a lazily loaded view's code chunk is downloading.
const LoadingFallback = ({ height = '100%', sx = {} }) => (
  <Box
    sx={{
      width: '100%',
      height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...sx,
    }}
  >
    <Spinner />
  </Box>
);

export default LoadingFallback;
