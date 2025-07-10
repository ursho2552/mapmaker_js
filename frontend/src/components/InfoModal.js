import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    Collapse
} from '@mui/material';

function InfoModal({ open, onClose, title, shortText, longText }) {
    const [showFullText, setShowFullText] = useState(false);

    useEffect(() => {
        if (open) {
            setShowFullText(false);
        }
    }, [open]);

    const handleToggleExpand = () => {
        setShowFullText(prev => !prev);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {shortText}
                </Typography>

                <Box mt={2}>
                    <Button variant="text" onClick={handleToggleExpand}>
                        {showFullText ? 'Show Less' : 'Learn More'}
                    </Button>

                    <Collapse in={showFullText}>
                        <Box mt={2}>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                {longText}
                            </Typography>
                        </Box>
                    </Collapse>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default InfoModal;