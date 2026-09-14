import React from 'react';
import { Box, CircularProgress } from '@mui/material';

// Placeholder shown while a lazily loaded view's code chunk is downloading.
const LoadingFallback = ({ height = '100%' }) => (
    <Box
        sx={{
            width: '100%',
            height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <CircularProgress sx={{ color: 'white' }} />
    </Box>
);

export default LoadingFallback;
