import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import InfoModal from "./InfoModal";

const Tutorial = ({ start, onFinish, panel1Year, setTutorialStep }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (step === 1 && panel1Year === 2050) {
            setTimeout(() => setStep(2), 600);
        }
        setTutorialStep?.(step);
    }, [panel1Year, step, setTutorialStep]);

    if (!start) return null;

    return (
        <Box>
            {/* Step 0 - Welcome */}
            <InfoModal
                open={step === 0}
                onClose={() => setStep(1)}
                title="Welcome to the MAPMAKER Tutorial"
                shortText="Learn how to explore plankton diversity scenarios."
                buttonText="Start Tutorial"
            />

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
                            backgroundColor: "rgba(0,0,0,0.7)",
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
            <InfoModal
                open={step === 2}
                onClose={() => {
                    setStep(0);
                    onFinish();
                }}
                title="Great job!"
                shortText="You've set the year to 2050. Tutorial completed."
            />
        </Box>
    );
};

export default Tutorial;