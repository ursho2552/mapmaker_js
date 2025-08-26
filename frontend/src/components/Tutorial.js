import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import InfoModal from "./InfoModal";

const Tutorial = ({ start, onFinish, panel1Year, setPanel1Year, setTutorialStep }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (step === 1 && panel1Year === 2050) {
            setTimeout(() => setStep(2), 600);
        }
        setTutorialStep?.(step);
    }, [panel1Year, step, setTutorialStep]);

    if (!start) return null;

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 3000,
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {/* Step 0 - Welcome */}
            {step === 0 && (

                <Box
                    sx={{
                        pointerEvents: "auto",
                        bgcolor: "rgba(10,20,40,0.95)",
                        p: 3,
                        borderRadius: 2,
                        boxShadow: "0 0 20px #4FC3F7",
                        maxWidth: 400,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h5" gutterBottom sx={{ color: "#fff" }}>
                        Welcome to the MAPMAKER Tutorial
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ color: "#ddd" }}>
                        Learn how to explore plankton diversity scenarios.
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setStep(1)}
                        sx={{ mt: 2 }}
                    >
                        Let's Start
                    </Button>
                </Box>
            )}

            {/* Step 1 - Highlight DataPanel */}
            {step === 1 && (
                <>
                    {/* Full-screen dark overlay */}
                    <Box
                        sx={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0,10,30,0.85)",
                            zIndex: 2999,
                            pointerEvents: "none",
                        }}
                    />

                    {/* Tooltip */}
                    <Box
                        sx={{
                            pointerEvents: "auto",
                            position: "absolute",
                            bottom: "15%",
                            left: "5%",
                            bgcolor: "rgba(10,20,40,0.9)",
                            p: 2,
                            borderRadius: 2,
                            boxShadow: "0 0 15px #4FC3F7",
                            maxWidth: 300,
                            zIndex: 3001,
                        }}
                    >
                        <Typography variant="body1" sx={{ color: "#fff" }}>
                            Use the <b>year slider</b> to set the year to <b>2050</b>.
                        </Typography>
                    </Box>
                </>
            )}


            {/* Step 2 - Completion */}
            {step === 2 && (
                <Box
                    sx={{
                        pointerEvents: "auto",
                        bgcolor: "rgba(10,20,40,0.95)",
                        p: 3,
                        borderRadius: 2,
                        boxShadow: "0 0 25px #4FC3F7",
                        maxWidth: 400,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h5" gutterBottom sx={{ color: "#fff" }}>
                        Great job! 🎉
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ color: "#ddd" }}>
                        You've set the year to 2050. Tutorial completed.
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            setStep(0);
                            onFinish();
                        }}
                        sx={{ mt: 2 }}
                    >
                        Finish
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default Tutorial;
