// Footer.js
import React from 'react';
import { Box, Paper } from '@mui/material';
import { alpha } from '@mui/material/styles';

const Footer = () => {
  // Logo definitions
  const logos = [
    {
      alt: 'ETH Zurich',
      src: '/assets/ETH_logo.png',
      href: 'https://up.ethz.ch/research/ongoing-projects.html',
    },
    {
      alt: 'GSPI',
      src: '/assets/GSPI_logo.png',
      href: 'https://gspi.ch/collaboration_projec/marine-plankton-diversity-bioindicator-scenarios-for-policy-makers-mapmaker/',
    },
    {
      alt: 'IUCN',
      src: '/assets/IUCN_logo.png',
      href: 'https://www.iucn.org/theme/marine-and-polar',
    },
    {
      alt: 'CMIP5 Data Archive',
      src: '/assets/CMIP5_Data_Archive_3.png',
      href: 'https://esgf-node.llnl.gov/search/cmip5/',
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#ffffff',   // White panel
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
              width: 180,    // fixed card width
              height: 80,    // fixed card height
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
