import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { tutorialNextButtonSx, tutorialTooltipSx } from '../styles/panels';

const TutorialTooltip = ({ text, onNext, onSkip, buttonText = 'Next', top = '50%', left = '50%' }) => (
  <Box sx={{ ...tutorialTooltipSx, top, left }}>
    <Typography variant="body1" sx={{ color: '#fff', mb: 2 }}>
      {text}
    </Typography>

    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
      {onSkip && (
        <Button
          variant="text"
          onClick={onSkip}
          sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}
        >
          Skip
        </Button>
      )}
      {onNext && (
        <Button variant="contained" onClick={onNext} sx={tutorialNextButtonSx}>
          {buttonText}
        </Button>
      )}
    </Box>
  </Box>
);

export default TutorialTooltip;
