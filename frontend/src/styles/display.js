// Inline `style` objects for the map, globe and line-plot figures, which render outside MUI.

const SURFACE_RADIUS = 4;

/** Plot margins of the map: room for the two-line title, the colour bar and some air around. */
export const PLOT_MARGIN = { l: 20, r: 90, t: 80, b: 24 };

/**
 * 4:3 box that the absolutely positioned surface fills, tall enough for the
 * title, the globe and its legend. The height cap keeps a full-width figure on
 * one screen when the columns stack.
 */
export const aspectBoxStyle = {
  position: 'relative',
  width: '100%',
  aspectRatio: '4 / 3',
  maxHeight: '75vh',
};

/** Transparent: figures sit directly on their panel's glass card. */
export const surfaceStyle = (loading) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: SURFACE_RADIUS,
  overflow: 'hidden',
  cursor: loading ? 'wait' : 'default',
});

export const titleStyle = {
  position: 'absolute',
  top: 10,
  left: '5%',
  width: '90%',
  textAlign: 'center',
  fontSize: 16,
  lineHeight: 1.3,
  color: 'white',
  pointerEvents: 'none',
  userSelect: 'none',
  zIndex: 5,
};

/** Message centred on a figure, e.g. "No data available". */
export const centerMessageStyle = (color) => ({
  position: 'absolute',
  top: '50%',
  left: 0,
  width: '100%',
  transform: 'translateY(-50%)',
  textAlign: 'center',
  padding: '0 16px',
  boxSizing: 'border-box',
  color,
  pointerEvents: 'none',
  zIndex: 6,
});

export const overlayStyle = (visible) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: visible ? 1 : 0,
  pointerEvents: visible ? 'all' : 'none',
  transition: 'opacity 0.2s ease',
  borderRadius: SURFACE_RADIUS,
  zIndex: 20,
});

export const zoomHintStyle = (visible) => ({
  position: 'absolute',
  bottom: 15,
  left: '50%',
  transform: `translateX(-50%) translateY(${visible ? 0 : 8}px)`,
  opacity: visible ? 1 : 0,
  transition: 'all 0.25s ease',
  pointerEvents: 'none',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  backgroundColor: 'rgba(0,0,0,0.8)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 20,
  padding: '6px 14px',
  color: 'white',
  fontSize: 12,
});

/** Colour bar drawn next to a globe (Plotly draws its own on the flat map). */
export const legendStyles = {
  container: (hasUnit) => ({
    position: 'absolute',
    top: 80,
    right: 10,
    width: hasUnit ? 84 : 70,
    height: 'calc(100% - 110px)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    pointerEvents: 'none',
    zIndex: 10,
  }),
  swatches: {
    width: 16,
    display: 'flex',
    flexDirection: 'column-reverse',
    border: '1px solid rgba(255,255,255,0.15)',
  },
  labels: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column-reverse',
    justifyContent: 'space-between',
    marginLeft: 4,
    // Half a label's height either side, so each label centres on its bin boundary.
    marginTop: -7,
    marginBottom: -7,
  },
  label: { color: 'white', fontSize: 11, lineHeight: '14px', whiteSpace: 'nowrap' },
  unit: {
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    marginLeft: 2,
    alignSelf: 'center',
  },
};

/** Plotly colour bar shared by every map. */
export const colorbarBase = {
  tickcolor: 'white',
  tickfont: { color: 'white', size: 11 },
  ticks: 'outside',
  thickness: 16,
  len: 0.95,
  outlinecolor: 'rgba(255,255,255,0.15)',
};

/**
 * Pads the colour bar title so Plotly always moves it clear of the tick labels;
 * a short unit could otherwise land between them. The span stops Plotly trimming it.
 */
const UNIT_TITLE_PADDING = `<span>${' '.repeat(60)}</span>`;

/** Plotly colour bar title, only rendered when the variable has a unit. */
export const colorbarUnitTitle = (unit) =>
  unit
    ? {
        title: {
          text: `${UNIT_TITLE_PADDING}${unit}${UNIT_TITLE_PADDING}`,
          side: 'right',
          font: { color: 'rgba(255,255,255,0.7)', size: 10 },
        },
      }
    : {};

/** Dark hover label shared by the Plotly figures. */
export const hoverLabel = {
  bgcolor: 'rgba(30,30,30,0.85)',
  bordercolor: 'rgba(255,255,255,0.2)',
  font: { color: 'white', size: 12 },
};

export const errorTextStyle = { color: '#ff6b6b', textAlign: 'center', padding: '10px' };
