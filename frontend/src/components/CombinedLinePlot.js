import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Box, IconButton, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { nameToLabelMapping } from '../constants';

const CombinedLinePlot = ({ point, leftSettings, rightSettings, startYear, endYear, zoomedArea }) => {
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

  const handleDownload = () => {
    if (!leftData || !rightData) return;

    const csvHeader = `Year,${leftSettings.source === 'plankton'
      ? nameToLabelMapping[leftSettings.index]
      : nameToLabelMapping[leftSettings.envParam]
      },${rightSettings.source === 'plankton'
        ? nameToLabelMapping[rightSettings.index]
        : nameToLabelMapping[rightSettings.envParam]
      }`;

    const years = leftData.x;
    const csvRows = years.map((year, i) => {
      const leftVal = leftData.y[i] ?? '';
      const rightVal = rightData.y[i] ?? '';
      return `${year},${leftVal},${rightVal}`;
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `time_series_${point.x.toFixed(2)}_${point.y.toFixed(2)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) return <div style={{ color: 'red' }}>Error loading chart: {error}</div>;
  if (!leftData || !rightData) return null;

  const leftName = leftSettings.source === 'plankton'
    ? nameToLabelMapping[leftSettings.index]
    : nameToLabelMapping[leftSettings.envParam];
  const rightName = rightSettings.source === 'plankton'
    ? nameToLabelMapping[rightSettings.index]
    : nameToLabelMapping[rightSettings.envParam];

  const layout = {
    margin: { l: 70, r: 70, t: 50, b: 50, pad: 2 },
    title: {
      text: `${leftName} and ${rightName}<br>at ${point.x.toFixed(2)}°E, ${point.y.toFixed(2)}°N`,
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
  };

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderRadius: 1,
        flex: 1,
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {/* Plotly chart */}
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
            },
          ]}
          layout={layout}
          config={{ displayModeBar: false }}
          style={{ width: '100%' }}
          useResizeHandler={true}
        />

        {/* Download button */}
        <Tooltip title="Download CSV">
          <IconButton
            onClick={handleDownload}
            sx={{
              position: 'absolute',
              top: 4,
              right: 8,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.4)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.6)',
              },
              zIndex: 10,
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
