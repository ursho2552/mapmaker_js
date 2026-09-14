import React from 'react';
import { legendStyles } from '../../styles/display';

/**
 * Vertical colour bar for the globe, which has no built-in one.
 * `legend` is `{ colors, labels }`, ordered from the low end upwards, with one
 * more label than colours: a label sits on every bin boundary. The bar spans
 * `height` pixels from `top`.
 */
const ColorLegend = ({ legend, unit = null, top, height }) => {
  if (!legend?.colors.length || !(height > 0)) return null;

  return (
    <div style={legendStyles.container(top, height)}>
      <div style={legendStyles.swatches}>
        {legend.colors.map((color, i) => (
          <div key={i} style={{ flex: 1, backgroundColor: color }} />
        ))}
      </div>

      <div style={legendStyles.labels}>
        {legend.labels.map((label, i) => (
          <div key={i} style={legendStyles.label}>{label}</div>
        ))}
      </div>

      {unit && <div style={legendStyles.unit}>{unit}</div>}
    </div>
  );
};

export default ColorLegend;
