/**
 * Usage (inside the header):
 *   <ReferencesButton sx={{ position: 'absolute', top: '50%', right: 16,
 *                           transform: 'translateY(-50%)' }} />
 */
import React, { useState } from 'react';
import { Button } from '@mui/material';
import ReferencesModal from './ReferencesModal';

const ReferencesButton = ({ sx, ...buttonProps }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        onClick={handleOpen}
        sx={{
          color: 'black',
          textTransform: 'none',
          p: 0,
          fontSize: 16,
          '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline',
          },
          ...sx,
        }}
        {...buttonProps}
      >
        References&nbsp;&amp;&nbsp;Data&nbsp;Courtesy
      </Button>

      <ReferencesModal open={open} onClose={handleClose} />
    </>
  );
};

export default ReferencesButton;
