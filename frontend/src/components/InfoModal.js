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
    Link,
    FormControlLabel,
    Checkbox
} from '@mui/material';

function InfoModal({
    open,
    onClose,
    title,
    shortText,
    longText,
    buttonText = 'Close',
    onDontShowAgainChange,
    showDontShowAgain = false,
}) {
    const [showFullText, setShowFullText] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        if (open) {
            setShowFullText(false);
            setDontShowAgain(false);
        }
    }, [open]);

    const handleToggleExpand = () => setShowFullText(prev => !prev);

    const handleCheckboxChange = (event) => {
        const checked = event.target.checked;
        setDontShowAgain(checked);
        if (onDontShowAgainChange) {
            onDontShowAgainChange(checked);
        }
    };

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem('hideProjectExplanation', 'true');
        } else {
            localStorage.removeItem('hideProjectExplanation');
        }
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            sx={{
                '& .MuiPaper-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(4px)',
                },
            }}
        >
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

                {/* Optional Don't show again checkbox */}
                {showDontShowAgain && (
                    <Box mt={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={dontShowAgain}
                                    onChange={handleCheckboxChange}
                                    color="primary"
                                />
                            }
                            label="Don’t show this again"
                        />
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>{buttonText}</Button>
            </DialogActions>
        </Dialog>
    );
}

export default InfoModal;
