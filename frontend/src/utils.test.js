import { differenceColors, sequentialColors, temperatureColors } from './constants';
import {
  bandedColorStops,
  figureTitle,
  generateColorbarTicks,
  getColorDomainForIndex,
  getColorscaleForIndex,
  getInterpolatedColorFromValue,
  getLegendFromColorscale,
  hexToRgb,
  unitOf,
} from './utils';

describe('labels', () => {
  test('unitOf reads the bracketed unit of a mapped label', () => {
    expect(unitOf('Temperature')).toBe('°C');
    expect(unitOf('Species Turnover')).toBe('-');
    expect(unitOf('Biomes')).toBeNull();
    expect(unitOf('Unmapped')).toBeNull();
  });

  test('figureTitle includes the group only when there is one', () => {
    const base = { index: 'Oxygen', scenario: 'RCP 4.5', model: 'Model Mean', year: 2050 };
    expect(figureTitle(base)).toBe('Oxygen [mg/L] predicted by RCP 4.5 on Model Mean in 2050');
    expect(figureTitle({ ...base, index: 'Biomes', group: 'Total Plankton' })).toBe(
      'Biomes and Total Plankton predicted by RCP 4.5 on Model Mean in 2050'
    );
  });
});

describe('colour scales', () => {
  test('bandedColorStops gives each colour its own band', () => {
    expect(bandedColorStops(['#000', '#fff'])).toEqual([
      [0, '#000'],
      [0.5, '#000'],
      [0.5, '#fff'],
      [1, '#fff'],
    ]);
  });

  test('changes and scenario differences use the diverging palette and a symmetric domain', () => {
    expect(getColorscaleForIndex('Change in HSI', 'RCP 4.5')[0][1]).toBe(differenceColors[0]);
    expect(getColorscaleForIndex('Species Richness', 'RCP 8.5 - RCP 2.6')[0][1]).toBe(differenceColors[0]);
    expect(getColorscaleForIndex('Temperature', 'RCP 4.5')[0][1]).toBe(temperatureColors[0]);
    expect(getColorscaleForIndex('Species Richness', 'RCP 4.5')[0][1]).toBe(sequentialColors[0]);

    expect(getColorDomainForIndex(-1, 3, 'Change in HSI', 'RCP 4.5')).toEqual([-3, 3]);
    expect(getColorDomainForIndex(-1, 3, 'Species Richness', 'RCP 4.5')).toEqual([-1, 3]);
  });

  test('hexToRgb expands short hex codes', () => {
    expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#3b4cc0')).toEqual({ r: 59, g: 76, b: 192 });
  });

  test('interpolation clamps out-of-range values and hides missing ones', () => {
    const stops = [[0, '#000000'], [1, '#ffffff']];
    expect(getInterpolatedColorFromValue(5, 0, 10, stops)).toBe('rgb(128,128,128)');
    expect(getInterpolatedColorFromValue(-5, 0, 10, stops)).toBe('rgb(0,0,0)');
    expect(getInterpolatedColorFromValue(50, 0, 10, stops)).toBe('rgb(255,255,255)');
    expect(getInterpolatedColorFromValue(null, 0, 10, stops)).toBe('rgba(0,0,0,0)');
    expect(getInterpolatedColorFromValue(NaN, 0, 10, stops)).toBe('rgba(0,0,0,0)');
  });
});

describe('legends', () => {
  test('ticks sit on every bin boundary', () => {
    expect(generateColorbarTicks(0, 10, 2)).toEqual({ tickvals: [0, 5, 10], ticktext: ['0', '5', '10'] });
    expect(generateColorbarTicks(null, 10, 2)).toEqual({ tickvals: [], ticktext: [] });
  });

  test('a banded legend has one more label than colours', () => {
    const legend = getLegendFromColorscale(bandedColorStops(['#000', '#888', '#fff']), 0, 0.3);
    expect(legend.colors).toEqual(['#000', '#888', '#fff']);
    expect(legend.labels).toEqual(['0.000', '0.100', '0.200', '0.300']);
  });
});
