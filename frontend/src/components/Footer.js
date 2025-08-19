import React from 'react';
import { Box, Paper } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { logos } from '../constants';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'transparent',
        py: 3,
        px: 2,
        mt: 4,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          flexWrap: 'wrap',
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
              width: 180,
              height: 80,
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
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
                maxHeight: '60px',
                maxWidth: '160px',
                objectFit: 'contain',
              }}
            />
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Footer;
