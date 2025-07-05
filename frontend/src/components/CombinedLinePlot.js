import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { nameToLabelMapping } from '../constants';

const CombinedLinePlot = ({ point, leftSettings, rightSettings, startYear, endYear }) => {
  const [leftData, setLeftData] = useState(null);
  const [rightData, setRightData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (point.x == null || point.y == null) return;
    setError(null);

    const buildUrl = (settings) =>
      `/api/line-data?x=${point.x}&y=${point.y}` +
      `&startYear=${startYear}&endYear=${endYear}` +
      `&index=${encodeURIComponent(settings.index)}` +
      `&group=${encodeURIComponent(settings.group || '')}` +
      `&scenario=${encodeURIComponent(settings.scenario)}` +
      `&model=${encodeURIComponent(settings.model)}` +
      `&envParam=${encodeURIComponent(settings.envParam)}`;

    Promise.all([
      fetch(buildUrl(leftSettings)).then(r => r.json()),
      fetch(buildUrl(rightSettings)).then(r => r.json()),
    ])
      .then(([d1, d2]) => {
        const leftTrace = leftSettings.source === 'plankton' ? d1.data[0] : d1.data[1];
        const rightTrace = rightSettings.source === 'plankton' ? d2.data[0] : d2.data[1];
        setLeftData(leftTrace);
        setRightData(rightTrace);
      })
      .catch(err => setError(err.toString()));
  }, [point, leftSettings, rightSettings, startYear, endYear]);

  if (error) return <div style={{ color: 'red' }}>Error loading chart: {error}</div>;
  if (!leftData || !rightData) return null;

  const leftName = leftSettings.source === 'plankton' ? nameToLabelMapping[leftSettings.index] : nameToLabelMapping[leftSettings.envParam];
  const rightName = rightSettings.source === 'plankton' ? nameToLabelMapping[rightSettings.index] : nameToLabelMapping[rightSettings.envParam];

  const layout = {
    title: {
      text: `${leftName} and ${rightName} at ${point.x.toFixed(2)}°E, ${point.y.toFixed(2)}°N`,
      font: { color: 'white' }
    },
    paper_bgcolor: '#282c34',
    plot_bgcolor: '#282c34',
    xaxis: {
      title: { text: 'Year', font: { color: 'white' } },
      tickfont: { color: 'white' },
      linecolor: 'white',
      tickcolor: 'white',
      gridcolor: '#444',
      zeroline: false,
    },
    yaxis: {
      title: leftName,
      color: 'cyan',
      showgrid: false,
      zeroline: false,
      linecolor: 'cyan',
      tickcolor: 'cyan',
    },
    yaxis2: {
      title: rightName,
      color: 'orange',
      overlaying: 'y',
      side: 'right',
      showgrid: false,
      linecolor: 'orange',
      tickcolor: 'orange',
      zeroline: false,
    },
    legend: { x: 0, y: 1, font: { color: 'white' } },
  };

  return (
    <Plot
      data={[
        {
          x: leftData.x,
          y: leftData.y,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: 'cyan' },
          showlegend: false,
        },
        {
          x: rightData.x,
          y: rightData.y,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: 'orange' },
          yaxis: 'y2',
          showlegend: false,
        }
      ]}
      layout={layout}
      config={{ displayModeBar: false }}
      useResizeHandler
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default CombinedLinePlot;
