import React from 'react';
import { Box, Paper } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { logos } from '../constants';

const Footer = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
        justifyContent: 'center',
        mb: 1,
      }}
    >
      {logos.map((logo) => (
        <Paper
          key={logo.alt}
          component="a"
          href={logo.href}
          target="_blank"
          rel="noopener noreferrer"
          elevation={2}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 200,
            height: 70,
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 1,
            textDecoration: 'none',
            transition: 'box-shadow 0.2s ease-in-out',
            '&:hover': {
              boxShadow: (theme) => theme.shadows[6],
              backgroundColor: alpha('#000000', 0.03),
            },
          }}
        >
          <Box
            component="img"
            src={logo.src}
            alt={logo.alt}
            sx={{
              maxHeight: '65px',
              maxWidth: '190px',
              objectFit: 'contain',
            }}
          />
        </Paper>
      ))}
    </Box>
  );
};

export default Footer;
