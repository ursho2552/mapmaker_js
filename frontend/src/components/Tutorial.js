import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import InfoModal from "./InfoModal";
import TutorialTooltip from "./TutorialTooltip";

const Tutorial = ({ start, onFinish, panel1Year, setTutorialStep }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (step === 2 && panel1Year === 2050) {
            setTimeout(() => setStep(3), 600);
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

            {/* Step 1 - Highlight both DataPanels */}
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

                    <TutorialTooltip
                        text="You can compare different scenarios, models, and datasets side by side."
                        onNext={() => setStep(2)}
                        buttonText="Next"
                        top="30%"
                        left="50%"
                    />
                </>)}

            {/* Step 2 - Highlight DataPanel */}
            {step === 2 && (
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

                    <TutorialTooltip
                        text="Use the year slider to set the year to 2050."
                        onNext={null}
                        top="70%"
                        left="25%"
                    />
                </>
            )}

            {/* Step 3 - Completion */}
            <InfoModal
                open={step === 3}
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