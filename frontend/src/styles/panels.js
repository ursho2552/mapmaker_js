// MUI `sx` fragments shared by the control surfaces (panels, selects, dialogs).
import { alpha } from '@mui/material/styles';

const TUTORIAL_ACCENT = '#4FC3F7';

/** Translucent dark card behind every panel and figure. */
export const glassPanelSx = {
  backgroundColor: 'rgba(0,0,0,0.25)',
  backdropFilter: 'blur(8px)',
  borderRadius: 1,
  border: '1px solid rgba(255,255,255,0.15)',
};

/** Clickable header strip of a collapsible panel. */
export const panelHeaderSx = (open) => ({
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  minHeight: 57,
  px: 2,
  py: 1,
  cursor: 'pointer',
  borderBottom: open ? '1px solid rgba(255,255,255,0.08)' : 'none',
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' },
});

export const panelTitleSx = { fontSize: 19, color: 'white' };

/** Frosted-glass input, used for every dropdown on the control panels. */
export const glassSelectSx = {
  backgroundColor: 'rgba(255,255,255,0.12)',
  backdropFilter: 'blur(12px)',
  borderRadius: 2,
  border: '1px solid rgba(255,255,255,0.25)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  '& .MuiInputBase-input': { color: '#fff' },
  '& .MuiSvgIcon-root': { color: '#fff' },
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
};

/** Dark dropdown surface matching `glassSelectSx`. */
export const darkMenuProps = {
  PaperProps: {
    sx: {
      backgroundColor: 'rgba(30, 30, 30, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.25)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      maxHeight: 400,
      '& .MuiMenuItem-root': {
        color: '#fff',
        '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
        '&.Mui-selected': { backgroundColor: 'rgba(255,255,255,0.2)' },
        '&.Mui-selected:hover': { backgroundColor: 'rgba(255,255,255,0.25)' },
      },
    },
  },
};

/** Map / Globe switch. */
export const viewToggleSx = {
  '& .MuiToggleButton-root': {
    color: 'rgba(255,255,255,0.6)',
    borderColor: 'rgba(255,255,255,0.25)',
    textTransform: 'none',
    py: 0.5,
    '&.Mui-selected': {
      color: '#fff',
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderColor: 'rgba(255,255,255,0.4)',
    },
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
  },
};

/** White icon button next to a label (info, lock). */
export const inlineIconButtonSx = {
  color: '#fff',
  p: 0.25,
  '&:hover': { color: TUTORIAL_ACCENT, backgroundColor: 'transparent' },
};

/** Small square button in a figure's corner, e.g. the CSV download. */
export const cornerButtonSx = {
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 15,
  width: 32,
  height: 32,
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.25)',
  borderRadius: 1,
  backgroundColor: 'rgba(30,30,30,0.75)',
  backdropFilter: 'blur(4px)',
  '&:hover': {
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(50,50,50,0.85)',
  },
};

/** Outlined white button in the header. */
export const headerButtonSx = {
  color: 'white',
  borderColor: 'rgba(255,255,255,0.5)',
  textTransform: 'none',
  fontSize: 15,
  '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.08)' },
};

/** Text link in the header. */
export const headerLinkSx = {
  color: 'white',
  textTransform: 'none',
  p: 0,
  fontSize: 17,
  '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
};

/** Light, frosted dialog surface used by the modals. */
export const frostedDialogSx = {
  '& .MuiPaper-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(4px)',
  },
};

/** Logo plate in the footer. */
export const logoTileSx = (width, height) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width,
  height,
  p: '5px',
  boxSizing: 'border-box',
  backgroundColor: 'rgba(0, 0, 0, 0.25)',
  borderRadius: 1,
  textDecoration: 'none',
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: (theme) => theme.shadows[6],
    backgroundColor: alpha('#000000', 0.03),
  },
});

/** Pulsing outline around the part of the page a tutorial step talks about. */
export const tutorialHighlightSx = (active) =>
  active
    ? {
        position: 'relative',
        zIndex: 3000,
        outline: `4px solid ${TUTORIAL_ACCENT}`,
        boxShadow: '0 0 30px 10px rgba(79,195,247,0.6)',
        animation: 'pulse 1.5s infinite',
      }
    : { position: 'relative' };

/** Glow applied to the lock icons while the tutorial talks about them. */
export const lockHighlightSx = {
  position: 'relative',
  zIndex: 3000,
  borderRadius: '50%',
  outline: `2px solid ${TUTORIAL_ACCENT}`,
  animation: 'pulse 1.5s infinite',
};

export const tutorialTooltipSx = {
  pointerEvents: 'auto',
  position: 'fixed',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'rgba(10,20,40,0.9)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(79,195,247,0.5)',
  p: 3,
  borderRadius: 2,
  boxShadow: `0 0 15px ${TUTORIAL_ACCENT}`,
  maxWidth: 350,
  textAlign: 'center',
  zIndex: 3001,
};

export const tutorialNextButtonSx = {
  backgroundColor: TUTORIAL_ACCENT,
  color: '#000',
  fontWeight: 'bold',
  '&:hover': { backgroundColor: '#29B6F6' },
};

export const errorTextSx = { color: '#ff6b6b', fontWeight: 'bold' };
