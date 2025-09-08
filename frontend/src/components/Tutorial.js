import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
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

    // Define tooltip data for each step
    const tooltips = [
        null,
        {
            text: "You can compare different scenarios, models, and datasets side by side.",
            top: "30%",
            left: "50%",
        },
        {
            text: "Each data panel allows you to switch between a flat map and a 3D globe for convenience.",
            top: "30%",
            left: "25%",
        },
        {
            text: "Use the year slider to visualize changes over time.",
            top: "40%",
            left: "25%",
        },
        {
            text: "Each panel has its own control panel: the left control panel affects the left data panel, and the right control panel affects the right data panel.",
            top: "60%",
            left: "50%",
        },
        {
            text: "For any parameter, click on the info icons to learn more about its meaning and source.",
            top: "20%",
            left: "50%",
        },
        {
            text: "Use Locks to Sync or Separate Panels. By default, the left and right data panels are synchronized, meaning the year, scenario, and model are linked. You can unlock these parameters individually if you want to compare different settings.",
            top: "60%",
            left: "50%",
        },
        {
            text: "You can select any point on the map or globe to explore how parameters evolve over time.",
            top: "70%",
            left: "30%",
        },
        {
            text: "Observe the time series for 0.00 0.00 displayed in the middle of the screen.",
            top: "40%",
            left: "50%",
        }
    ];

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

            {/* Dark overlay for all tooltip steps */}
            {step > 0 && step < 8 && (
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
                onClose={() => {
                    setStep(0);
                    onFinish();
                }}
                title="Congratulations, you’ve completed the tutorial!"
                shortText="You can revisit it anytime by clicking the “Start Tutorial” button. Have fun exploring the website!"
            />
        </Box>
    );
};

export default Tutorial;
