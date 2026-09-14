import React from "react";
import { Box, Typography, Button } from "@mui/material";

const TutorialTooltip = ({ text, onNext, onSkip, buttonText = "Next", top = "50%", left = "50%" }) => {
    return (
        <Box
            sx={{
                pointerEvents: "auto",
                position: "fixed",
                top,
                left,
                transform: "translate(-50%, -50%)",
                bgcolor: "rgba(10,20,40,0.9)",
                p: 3,
                borderRadius: 2,
                boxShadow: "0 0 15px #4FC3F7",
                maxWidth: 350,
                textAlign: "center",
                zIndex: 3001,
            }}
        >
            <Typography variant="body1" sx={{ color: "#fff", mb: 2 }}>
                {text}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                {onSkip && (
                    <Button
                        variant="text"
                        onClick={onSkip}
                        sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "#fff" } }}
                    >
                        Skip
                    </Button>
                )}
                {onNext && (
                    <Button
                        variant="contained"
                        onClick={onNext}
                        sx={{
                            backgroundColor: "#4FC3F7",
                            color: "#000",
                            fontWeight: "bold",
                            "&:hover": {
                                backgroundColor: "#29B6F6",
                            },
                        }}
                    >
                        {buttonText}
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default TutorialTooltip;
