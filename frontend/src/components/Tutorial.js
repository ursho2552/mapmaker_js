import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import InfoModal from "./InfoModal";
import TutorialTooltip from "./TutorialTooltip";
import { tooltips } from "../content";

const Tutorial = ({ start, onFinish, panel1Year, setTutorialStep }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        setTutorialStep?.(step);
        if (step === 2 && panel1Year === 2050) {
            const timer = setTimeout(() => setStep(3), 600);
            return () => clearTimeout(timer);
        }
    }, [panel1Year, step, setTutorialStep]);

    const skip = () => {
        setStep(0);
        onFinish();
    };

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
                secondaryButtonText="Skip"
                onSecondaryClick={skip}
            />

            {/* Dark overlay for all tooltip steps */}
            {step > 0 && step < 9 && (
                <>
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

                    {tooltips[step] && (
                        <TutorialTooltip
                            text={tooltips[step].text}
                            onNext={() => setStep(step + 1)}
                            onSkip={skip}
                            buttonText="Next"
                            top={tooltips[step].top}
                            left={tooltips[step].left}
                        />
                    )}
                </>
            )}

            {/* Step 4 - Completion */}
            <InfoModal
                open={step === 9}
                onClose={skip}
                title="Congratulations, you’ve completed the tutorial!"
                shortText="You can revisit it anytime by clicking the “Start Tutorial” button. Have fun exploring the website!"
            />
        </Box>
    );
};

export default Tutorial;
