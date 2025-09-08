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

    // Tutorial steps
    const tooltips = [
        null, // Step 0: Welcome modal
        { // Step 1
            text: "You can compare different scenarios, models, and datasets side by side.",
            top: "30%",
            left: "50%",
        },
        { // Step 2
            text: "Each data panel allows you to switch between a flat map and a 3D globe for convenience.",
            top: "30%",
            left: "25%",
        },
        { // Step 3
            text: "Use the year slider to visualize changes over time.",
            top: "35%",
            left: "16%",
        },
        { // Step 4
            text: "Each panel has a corresponding control panel, where you can select the scenario, model, and other parameters to display.",
            top: "60%",
            left: "50%",
        },
        { // Step 5
            text: "Use locks to sync or separate panels. By default, the left and right data panels are synchronized, meaning the year, scenario, and model are linked. You can unlock these parameters individually if you want to compare different settings.",
            top: "65%",
            left: "50%",
        },
        { // Step 6
            text: "For any parameter, click on the info icons to learn more about its meaning and source.",
            top: "60%",
            left: "40%",
        },
        { // Step 7
            text: "You can select any point on the map or globe to explore how parameters evolve over time.",
            top: "75%",
            left: "17%",
        },
        { // Step 8
            text: "Observe the time series for the selected point.",
            top: "43%",
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
