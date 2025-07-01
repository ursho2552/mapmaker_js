import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const CombinedLinePlot = ({ point, leftSettings, rightSettings, startYear, endYear }) => {
  const [leftData, setLeftData] = useState(null);
  const [rightData, setRightData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch when we have a valid point
    if (point.x == null || point.y == null) return;
    setError(null);
    // Build query strings
    const buildUrl = (settings) =>
      `/api/line-data?x=${point.x}&y=${point.y}` +
      `&startYear=${startYear}&endYear=${endYear}` +
      `&index=${encodeURIComponent(settings.index)}` +
      `&group=${encodeURIComponent(settings.group || '')}` +
      `&scenario=${encodeURIComponent(settings.scenario)}` +
      `&model=${encodeURIComponent(settings.model)}` +
      `&envParam=${encodeURIComponent(settings.envParam)}`;
    // Fetch both series
    Promise.all([
      fetch(buildUrl(leftSettings)).then(r => r.json()),
      fetch(buildUrl(rightSettings)).then(r => r.json()),
    ])
      .then(([d1, d2]) => {
        // Choose primary trace: index for plankton source, envParam for environmental source
        const leftTrace = leftSettings.source === 'plankton' ? d1.data[0] : d1.data[1];
        const rightTrace = rightSettings.source === 'plankton' ? d2.data[0] : d2.data[1];
        setLeftData(leftTrace);
        setRightData(rightTrace);
      })
      .catch(err => setError(err.toString()));
  }, [point, leftSettings, rightSettings, startYear, endYear]);

  if (error) return <div style={{ color: 'red' }}>Error loading chart: {error}</div>;
  if (!leftData || !rightData) return null;

  // Determine display names for each trace
  const leftName = leftSettings.source === 'plankton' ? leftSettings.index : leftSettings.envParam;
  const rightName = rightSettings.source === 'plankton' ? rightSettings.index : rightSettings.envParam;
  const layout = {
    title: {
      text: `${leftName} and ${rightName} at ${point.x.toFixed(2)}°E, ${point.y.toFixed(2)}°N`,
      font: { color: 'white' }
    },
    paper_bgcolor: '#282c34',
    plot_bgcolor: '#282c34',
    margin: { t: 40, b: 40, l: 60, r: 60 },
    xaxis: { title: 'Year', color: 'white' },
    yaxis: { title: leftName, color: 'white' },
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
          name: `Left: ${leftName}`,
          line: { color: 'cyan' }
        },
        {
          x: rightData.x,
          y: rightData.y,
          type: 'scatter',
          mode: 'lines+markers',
          name: `Right: ${rightName}`,
          line: { color: 'orange' }
        }
      ]}
      layout={layout}
      config={{ displayModeBar: false }}
      useResizeHandler
      style={{ width: '100%', height: '400px' }}
    />
  );
};

export default CombinedLinePlot;