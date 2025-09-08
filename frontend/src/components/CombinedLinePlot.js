import React, { useEffect, useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Box, IconButton, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { nameToLabelMapping } from '../constants';

const CombinedLinePlot = ({ point, leftSettings, rightSettings, startYear, endYear }) => {
  const [leftData, setLeftData] = useState(null);
  const [rightData, setRightData] = useState(null);
  const [error, setError] = useState(null);

  // Helper: Build API URL
  const buildUrl = (settings, x, y, startYear, endYear) =>
    `/api/line-data?x=${x}&y=${y}` +
    `&startYear=${startYear}&endYear=${endYear}` +
    `&index=${encodeURIComponent(settings.index)}` +
    `&group=${encodeURIComponent(settings.group || '')}` +
    `&scenario=${encodeURIComponent(settings.scenario)}` +
    `&model=${encodeURIComponent(settings.model)}` +
    `&envParam=${encodeURIComponent(settings.envParam)}`;

  // Helper: Extract trace from API response
  const getTraceData = (data, settings) =>
    settings.source === 'plankton' ? data.data[0] : data.data[1];

  // Compute names upfront
  const leftName = leftSettings.source === 'plankton'
    ? nameToLabelMapping[leftSettings.index]
    : nameToLabelMapping[leftSettings.envParam];

  const rightName = rightSettings.source === 'plankton'
    ? nameToLabelMapping[rightSettings.index]
    : nameToLabelMapping[rightSettings.envParam];

  // Memoized layout
  const layout = useMemo(() => ({
    margin: { l: 70, r: 70, t: 50, b: 50, pad: 2 },
    title: {
      text: `${leftName} and ${rightName}` +
        (point?.x != null && point?.y != null
          ? `<br>at ${point.x.toFixed(2)}°E, ${point.y.toFixed(2)}°N`
          : ''),
      font: { color: 'white' }
    },
    paper_bgcolor: 'rgba(18, 18, 18, 0.6)',
    plot_bgcolor: 'rgba(18, 18, 18, 0.6)',
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
  }), [leftName, rightName, point]);

  // Fetch data
  useEffect(() => {
    if (point.x == null || point.y == null) return;
    setError(null);

    Promise.all([
      fetch(buildUrl(leftSettings, point.x, point.y, startYear, endYear)).then(r => r.json()),
      fetch(buildUrl(rightSettings, point.x, point.y, startYear, endYear)).then(r => r.json()),
    ])
      .then(([d1, d2]) => {
        setLeftData(getTraceData(d1, leftSettings));
        setRightData(getTraceData(d2, rightSettings));
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load data.');
      });
  }, [point, leftSettings, rightSettings, startYear, endYear]);

  // CSV download
  const handleDownload = () => {
    if (!leftData || !rightData) return;

    const csvHeader = `Year,${leftName},${rightName}`;
    const csvRows = leftData.x.map((year, i) => {
      const leftVal = leftData.y[i] ?? '';
      const rightVal = rightData.y[i] ?? '';
      return `${year},${leftVal},${rightVal}`;
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `time_series_${point.x.toFixed(2)}_${point.y.toFixed(2)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (error) return <div style={{ color: 'red' }}>Error loading chart: {error}</div>;
  if (!leftData || !rightData) return <div>Loading chart...</div>;

  return (
    <Box sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.25)', borderRadius: 1, flex: 1, position: 'relative' }}>
      <Box sx={{ position: 'relative' }}>
        <Plot
          data={[
            { x: leftData.x, y: leftData.y, type: 'scatter', mode: 'lines+markers', line: { color: 'cyan' }, showlegend: false },
            { x: rightData.x, y: rightData.y, type: 'scatter', mode: 'lines+markers', line: { color: 'orange' }, yaxis: 'y2', showlegend: false }
          ]}
          layout={layout}
          config={{ displayModeBar: false }}
          style={{ width: '100%' }}
          useResizeHandler={true}
        />

        <Tooltip title="Download CSV">
          <IconButton
            onClick={handleDownload}
            sx={{
              position: 'absolute',
              top: 4,
              right: 8,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.4)',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
              zIndex: 10,
              pointerEvents: 'auto'
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default CombinedLinePlot;