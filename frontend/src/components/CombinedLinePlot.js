import React, { useEffect, useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Box, IconButton, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { nameToLabelMapping } from '../constants';

// Utility helpers
const buildUrl = (settings, point, startYear, endYear, zoomedArea = null) => {
  const base = zoomedArea
    ? `/api/line-data?xMin=${zoomedArea.x[0]}&xMax=${zoomedArea.x[1]}&yMin=${zoomedArea.y[0]}&yMax=${zoomedArea.y[1]}`
    : `/api/line-data?x=${point.x}&y=${point.y}`;

  return (
    `${base}&startYear=${startYear}&endYear=${endYear}` +
    `&index=${encodeURIComponent(settings.index)}` +
    `&group=${encodeURIComponent(settings.group || '')}` +
    `&scenario=${encodeURIComponent(settings.scenario)}` +
    `&model=${encodeURIComponent(settings.model)}` +
    `&envParam=${encodeURIComponent(settings.envParam)}`
  );
};

const getTrace = (data, source) =>
  source === 'plankton' ? data.data[0] : data.data[1];

const getName = (settings) =>
  settings.source === 'plankton'
    ? nameToLabelMapping[settings.index]
    : nameToLabelMapping[settings.envParam];

const CombinedLinePlot = ({
  point,
  leftSettings,
  rightSettings,
  startYear,
  endYear,
  zoomedArea,
}) => {
  const [leftData, setLeftData] = useState(null);
  const [rightData, setRightData] = useState(null);
  const [leftAreaData, setLeftAreaData] = useState(null);
  const [rightAreaData, setRightAreaData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch data
  useEffect(() => {
    if (point.x == null || point.y == null) return;

    const fetchData = async () => {
      try {
        setError(null);

        const [leftRes, rightRes, leftAreaRes, rightAreaRes] = await Promise.all([
          fetch(buildUrl(leftSettings, point, startYear, endYear)).then((r) => r.json()),
          fetch(buildUrl(rightSettings, point, startYear, endYear)).then((r) => r.json()),
          zoomedArea
            ? fetch(buildUrl(leftSettings, point, startYear, endYear, zoomedArea)).then((r) => r.json())
            : null,
          zoomedArea
            ? fetch(buildUrl(rightSettings, point, startYear, endYear, zoomedArea)).then((r) => r.json())
            : null,
        ]);

        setLeftData(getTrace(leftRes, leftSettings.source));
        setRightData(getTrace(rightRes, rightSettings.source));

        if (zoomedArea) {
          setLeftAreaData(leftAreaRes ? getTrace(leftAreaRes, leftSettings.source) : null);
          setRightAreaData(rightAreaRes ? getTrace(rightAreaRes, rightSettings.source) : null);
        } else {
          setLeftAreaData(null);
          setRightAreaData(null);
        }
      } catch (err) {
        setError(err.message || 'Error fetching data');
      }
    };

    fetchData();
  }, [point, zoomedArea, leftSettings, rightSettings, startYear, endYear]);

  // CSV download
  const handleDownload = () => {
    if (!leftData || !rightData) return;

    const csvHeader = ['Year', getName(leftSettings), getName(rightSettings)].join(',');

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
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Layout memoization
  const layout = useMemo(
    () => {
      const title = zoomedArea ?
        `Zoomed Area Mean of<br> ${getName(leftSettings)} and ${getName(rightSettings)}` :
        `${getName(leftSettings)} and ${getName(rightSettings)}<br> at ${point.x.toFixed(2)}°E, ${point.y.toFixed(2)}°N`;
      return {
        margin: { l: 70, r: 70, t: 70, b: 50, pad: 2 },
        title: {
          text: title,
          font: { color: 'white' },
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
          title: getName(leftSettings),
          color: 'cyan',
          showgrid: false,
          zeroline: false,
          linecolor: 'cyan',
          tickcolor: 'cyan',
        },
        yaxis2: {
          title: getName(rightSettings),
          color: 'orange',
          overlaying: 'y',
          side: 'right',
          showgrid: false,
          linecolor: 'orange',
          tickcolor: 'orange',
          zeroline: false,
        },
        showlegend: false,
      };
    },
    [leftSettings, rightSettings, point, zoomedArea]
  );

  // Render states
  if (error) return <div style={{ color: 'red' }}>Error loading chart: {error}</div>;
  if (!leftData || !rightData) return null;

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
        <Plot
          data={[
            // Left panel trace
            ...(zoomedArea && leftAreaData
              ? [
                {
                  x: leftAreaData.x,
                  y: leftAreaData.y,
                  type: 'scatter',
                  mode: 'lines+markers',
                  line: { color: 'cyan' },
                },
              ]
              : [
                {
                  x: leftData.x,
                  y: leftData.y,
                  type: 'scatter',
                  mode: 'lines+markers',
                  line: { color: 'cyan' },
                },
              ]),

            // Right panel trace
            ...(zoomedArea && rightAreaData
              ? [
                {
                  x: rightAreaData.x,
                  y: rightAreaData.y,
                  type: 'scatter',
                  mode: 'lines+markers',
                  line: { color: 'orange' },
                  yaxis: 'y2',
                },
              ]
              : [
                {
                  x: rightData.x,
                  y: rightData.y,
                  type: 'scatter',
                  mode: 'lines+markers',
                  line: { color: 'orange' },
                  yaxis: 'y2',
                },
              ]),
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