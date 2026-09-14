import React, { useState } from 'react';
import { Button } from '@mui/material';
import ReferencesModal from './ReferencesModal';
import { headerLinkSx } from '../styles/panels';

/** "About" link in the header, and the references dialog it opens. */
const ReferencesButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} sx={headerLinkSx}>
        About
      </Button>
      <ReferencesModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default ReferencesButton;
