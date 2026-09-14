import React from 'react';
import { figureBoxStyle } from '../../styles/display';

// Container for `cqw` units, which size the box from its own width.
const containerStyle = { containerType: 'inline-size' };

/** Box sized for a figure's title and map, see `figureBoxStyle`. */
const FigureBox = ({ children }) => (
  <div style={containerStyle}>
    <div style={figureBoxStyle}>{children}</div>
  </div>
);

export default FigureBox;
