import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from '@mui/material';

const ProjectExplanationModal = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Welcome to MAPMAKER!</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    This project visualizes marine plankton diversity bioindicator scenarios for policy makers.

                    Explore spatial and temporal patterns using interactive globe and map displays.
                    Compare different diversity indices, environmental parameters, and climate scenarios to understand potential future changes.
                </Typography>
                <img
                    src="/assets/website_screenshot.png"
                    alt="website screenshot"
                    style={{ width: '100%', marginTop: '16px', borderRadius: '8px' }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProjectExplanationModal;
