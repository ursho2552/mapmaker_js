// Pure helpers for colour scales, legends and label formatting.

import { differenceColors, nameToLabelMapping, sequentialColors, temperatureColors } from './constants';

// --- labels ---------------------------------------------------------------

/** Display label of an index or parameter, with its unit, e.g. "Temperature [°C]". */
export const readableLabel = (name) => nameToLabelMapping[name] || name;

/** Unit in square brackets at the end of a label, e.g. "°C"; null when there is none. */
export const unitOf = (name) => readableLabel(name)?.match(/\[([^\]]+)\]\s*$/)?.[1] ?? null;

/** Title above a map or globe. */
export const figureTitle = ({ index, group, scenario, model, year }) =>
  `${readableLabel(index)}${group ? ` and ${group}` : ''} predicted by ${scenario} on ${model} in ${year}`;

// --- colour scales --------------------------------------------------------

/** Scenario differences and changes over time are drawn on a diverging scale centred on zero. */
const isDifference = (index, scenario) => index.includes('Change') || scenario.includes('-');

/** Two stops per colour, which makes Plotly draw discrete bands instead of a ramp. */
export const bandedColorStops = (colors) =>
  colors.flatMap((color, i) => [
    [i / colors.length, color],
    [(i + 1) / colors.length, color],
  ]);

export const getColorscaleForIndex = (index, scenario) => {
  const colors = isDifference(index, scenario)
    ? differenceColors
    : index.includes('Temperature')
      ? temperatureColors
      : sequentialColors;
  return bandedColorStops(colors);
};

export const getColorDomainForIndex = (minVal, maxVal, index, scenario) => {
  if (isDifference(index, scenario)) {
    const absMax = Math.max(Math.abs(minVal), Math.abs(maxVal));
    return [-absMax, absMax];
  }
  return [minVal, maxVal];
};

export const hexToRgb = (hex) => {
  const normalized = hex.replace('#', '');
  const fullHex =
    normalized.length === 3
      ? normalized.split('').map((c) => c + c).join('')
      : normalized;

  const value = parseInt(fullHex, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
};

/**
 * Colour for `value` on `stops`, linearly interpolating between the two it falls
 * between. Values outside [min, max] take the colour of the nearer end.
 */
export const getInterpolatedColorFromValue = (value, min, max, stops) => {
  if (value == null || !Number.isFinite(value)) return 'rgba(0,0,0,0)';
  if (min === max) return stops[stops.length - 1][1];

  const norm = Math.max(0, Math.min(1, (value - min) / (max - min)));

  for (let i = 0; i < stops.length - 1; i++) {
    const [start, startColor] = stops[i];
    const [end, endColor] = stops[i + 1];
    if (norm < start || norm > end) continue;

    const span = end - start;
    if (span === 0) return endColor;

    const ratio = (norm - start) / span;
    const from = hexToRgb(startColor);
    const to = hexToRgb(endColor);
    const mix = (a, b) => Math.round(a + ratio * (b - a));

    return `rgb(${mix(from.r, to.r)},${mix(from.g, to.g)},${mix(from.b, to.b)})`;
  }

  return stops[stops.length - 1][1];
};

// --- legends --------------------------------------------------------------

/** Ticks on the `numBins + 1` boundaries of evenly sized bins between min and max. */
export const generateColorbarTicks = (min, max, numBins) => {
  if (min == null || max == null) return { tickvals: [], ticktext: [] };

  const range = max - min;
  const step = range / numBins;
  const precision = range >= 4 ? 0 : range >= 1 ? 2 : 3;

  const tickvals = [];
  const ticktext = [];

  for (let i = 0; i <= numBins; i++) {
    const val = min + step * i;
    tickvals.push(val);
    ticktext.push(val.toFixed(precision));
  }

  return { tickvals, ticktext };
};

/** `{ colors, labels }` for a banded colour scale: one colour per band, a label per boundary. */
export const getLegendFromColorscale = (colorscale, minValue, maxValue) => {
  const numBins = colorscale.length / 2;
  const { ticktext } = generateColorbarTicks(minValue, maxValue, numBins);
  const colors = colorscale.filter((_, i) => i % 2 === 0).map(([, color]) => color);
  return { colors, labels: ticktext };
};
