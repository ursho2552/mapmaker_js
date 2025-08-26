import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    Collapse,
    Link
} from '@mui/material';

function InfoModal({ open, onClose, title, shortText, longText, buttonText = 'Close' }) {
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

                {longText && (
                    <Box mt={2}>
                        <Link
                            component="button"
                            variant="body2"
                            underline="hover"
                            onClick={handleToggleExpand}
                            sx={{ color: 'primary.main', fontWeight: 500 }}
                        >
                            {showFullText ? 'Show Less' : 'Learn More'}
                        </Link>

                        <Collapse in={showFullText}>
                            <Box mt={2}>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                                    {longText}
                                </Typography>
                            </Box>
                        </Collapse>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{buttonText}</Button>
            </DialogActions>
        </Dialog>
    );
}

export default InfoModal;
