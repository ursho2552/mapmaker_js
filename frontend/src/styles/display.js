// Inline `style` objects for the map, globe and line-plot figures, which render outside MUI.

const SURFACE_RADIUS = 4;

/** Space between the title and the top of the map or globe. */
const TITLE_GAP = 16;

/**
 * Margins around the map, or the globe in its place: room for a two-line title
 * above, the colour bar on the right and a little air elsewhere.
 */
export const PLOT_MARGIN = { l: 20, r: 90, t: 76, b: 12 };

/**
 * Box that the absolutely positioned surface fills: exactly tall enough for the
 * title and a full 2:1 map (`50cqw` is half the box's width, see `FigureBox`).
 * The height cap keeps a full-width figure on one screen when the columns stack.
 */
export const figureBoxStyle = {
  position: 'relative',
  width: '100%',
  height: `min(calc(50cqw + ${PLOT_MARGIN.t + PLOT_MARGIN.b - (PLOT_MARGIN.l + PLOT_MARGIN.r) / 2}px), 75vh)`,
};

/** Size in pixels of the area a map or globe fills within a surface of the given size. */
export const figureArea = (width, height) => {
  const plotWidth = width - PLOT_MARGIN.l - PLOT_MARGIN.r;
  const plotHeight = height - PLOT_MARGIN.t - PLOT_MARGIN.b;
  return { width: Math.max(0, plotWidth), height: Math.max(0, Math.min(plotHeight, plotWidth / 2)) };
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

/** Figure title, sitting just above the map or globe. */
export const titleStyle = {
  position: 'absolute',
  bottom: `calc(100% - ${PLOT_MARGIN.t - TITLE_GAP}px)`,
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

/** globe.gl's globe radius, initial camera distance (altitude 2.5 radii) and vertical field of view (three.js default). */
const GLOBE_RADIUS = 100;
const GLOBE_CAMERA_DISTANCE = 350;
const GLOBE_CAMERA_FOV = 50;

/** Fraction of its canvas's height the globe spans, seen from the initial camera distance. */
const GLOBE_HEIGHT_FRACTION =
  GLOBE_RADIUS /
  Math.sqrt(GLOBE_CAMERA_DISTANCE ** 2 - GLOBE_RADIUS ** 2) /
  Math.tan((GLOBE_CAMERA_FOV * Math.PI) / 360);

/**
 * Position and size of the globe's canvas that fit a globe of `diameter` pixels
 * into the figure area, where a map would be. The canvas overhangs the surface,
 * which clips it, since the globe only fills the middle of it.
 */
export const globeCanvasStyle = (surfaceWidth, diameter) => {
  const height = diameter / GLOBE_HEIGHT_FRACTION;
  return {
    position: 'absolute',
    top: PLOT_MARGIN.t - (height - diameter) / 2,
    // Centred on the map area, which the colour bar pushes left of the surface's middle.
    left: (PLOT_MARGIN.l - PLOT_MARGIN.r) / 2,
    width: surfaceWidth,
    height,
  };
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
  /** Spans `height` pixels from `top`; shrinks to its labels' width so the unit sits right beside them. */
  container: (top, height) => ({
    position: 'absolute',
    top,
    right: 10,
    height,
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
    marginLeft: 4,
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
