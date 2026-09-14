import React, { useMemo } from 'react';
import Plot from './Plot';
import { Box, IconButton, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { fetchTimeseries } from '../api/client';
import { useAsyncData } from '../hooks/useAsyncData';
import LoadingOverlay from './common/LoadingOverlay';
import { readableLabel } from '../utils';
import { cornerButtonSx, glassPanelSx } from '../styles/panels';
import { errorTextStyle, hoverLabel } from '../styles/display';

const LEFT_COLOR = 'cyan';
const RIGHT_COLOR = 'orange';
const GRID_COLOR = 'rgba(255,255,255,0.1)';

// The series of `source`'s variable in a timeseries response, or null.
const getTrace = (data, source) => {
  if (!data) return null;

  const isPlankton = source === 'plankton';
  const variable = isPlankton ? data.variable : data.environmental_variable;

  if (!variable) return null;

  return {
    x: data.years,
    y: variable.values,
    std: variable.std || [],
    name: variable.name,
  };
};

const getName = (settings) =>
  readableLabel(settings.source === 'plankton' ? settings.index : settings.envParam);

const CombinedLinePlot = ({
  point,
  leftSettings,
  rightSettings,
  startYear,
  endYear,
  zoomedArea,
}) => {
  // The settings are new objects on every parent render; compare them by value,
  // so the series are only refetched when a selection actually changes.
  const selectionKey = JSON.stringify([point, zoomedArea, leftSettings, rightSettings, startYear, endYear]);

  const { data: series, loading, error } = useAsyncData(
    async (signal) => {
      const load = (settings, area = null) =>
        fetchTimeseries({ settings, point, area, startYear, endYear }, signal)
          .then((res) => getTrace(res, settings.source));

      const [left, right, leftArea, rightArea] = await Promise.all([
        load(leftSettings),
        load(rightSettings),
        zoomedArea ? load(leftSettings, zoomedArea) : null,
        zoomedArea ? load(rightSettings, zoomedArea) : null,
      ]);
      return { left, right, leftArea, rightArea };
    },
    [selectionKey],
    { enabled: point.x != null && point.y != null }
  );

  const leftData = series?.left ?? null;
  const rightData = series?.right ?? null;
  const leftAreaData = series?.leftArea ?? null;
  const rightAreaData = series?.rightArea ?? null;

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

  const layout = useMemo(() => {
    const title = zoomedArea
      ? `Zoomed Area Mean (±1 SD) of ${getName(leftSettings)}<br> and ${getName(rightSettings)}`
      : `${getName(leftSettings)} and<br> ${getName(rightSettings)} at ${point.x.toFixed(2)}°E, ${point.y.toFixed(2)}°N`;

    return {
      margin: { l: 70, r: 70, t: 70, b: 50, pad: 2 },
      title: { text: title, font: { color: 'white', size: 16 } },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      hoverlabel: hoverLabel,
      xaxis: {
        title: { text: 'Year', font: { color: 'white' } },
        tickfont: { color: 'white' },
        linecolor: 'rgba(255,255,255,0.4)',
        tickcolor: 'rgba(255,255,255,0.4)',
        gridcolor: GRID_COLOR,
        zeroline: false,
      },
      yaxis: {
        title: getName(leftSettings),
        color: LEFT_COLOR,
        linecolor: LEFT_COLOR,
        tickcolor: LEFT_COLOR,
        gridcolor: GRID_COLOR,
        zeroline: false,
      },
      yaxis2: {
        title: getName(rightSettings),
        color: RIGHT_COLOR,
        overlaying: 'y',
        side: 'right',
        linecolor: RIGHT_COLOR,
        tickcolor: RIGHT_COLOR,
        showgrid: false,
        zeroline: false,
      },
      showlegend: false,
    };
  }, [leftSettings, rightSettings, point, zoomedArea]);

  if (error) {
    return (
      <Box sx={{ ...glassPanelSx, p: 2 }}>
        <div style={errorTextStyle}>Error loading chart: {error}</div>
      </Box>
    );
  }
  if (!leftData || !rightData) return null;

  // With a zoomed area, plot its mean (±1 SD) instead of the selected point.
  const leftTraceData = zoomedArea && leftAreaData ? leftAreaData : leftData;
  const rightTraceData = zoomedArea && rightAreaData ? rightAreaData : rightData;

  const plotData = [];

  if (leftTraceData) {
    const yUpper = leftTraceData.y.map((v, i) => v + (leftTraceData.std?.[i] ?? 0));
    const yLower = leftTraceData.y.map((v, i) => v - (leftTraceData.std?.[i] ?? 0));

    if (zoomedArea) {
      // ±1 SD band
      plotData.push({
        x: [...leftTraceData.x, ...leftTraceData.x.slice().reverse()],
        y: [...yUpper, ...yLower.slice().reverse()],
        fill: 'toself',
        fillcolor: 'rgba(0, 255, 255, 0.2)',
        line: { color: 'transparent' },
        type: 'scatter',
        hoverinfo: 'skip',
        showlegend: false,
      });
    }

    plotData.push({
      x: leftTraceData.x,
      y: leftTraceData.y,
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: LEFT_COLOR },
    });
  }

  if (rightTraceData) {
    const yUpper = rightTraceData.y.map((v, i) => v + (rightTraceData.std?.[i] ?? 0));
    const yLower = rightTraceData.y.map((v, i) => v - (rightTraceData.std?.[i] ?? 0));

    if (zoomedArea) {
      // ±1 SD band
      plotData.push({
        x: [...rightTraceData.x, ...rightTraceData.x.slice().reverse()],
        y: [...yUpper, ...yLower.slice().reverse()],
        fill: 'toself',
        fillcolor: 'rgba(255, 165, 0, 0.2)',
        line: { color: 'transparent' },
        type: 'scatter',
        yaxis: 'y2',
        hoverinfo: 'skip',
        showlegend: false,
      });
    }

    plotData.push({
      x: rightTraceData.x,
      y: rightTraceData.y,
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: RIGHT_COLOR },
      yaxis: 'y2',
    });
  }

  return (
    <Box sx={{ ...glassPanelSx, p: 2, flex: 1, position: 'relative' }}>
      <Box sx={{ position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
        <Plot
          data={plotData}
          layout={layout}
          config={{ displayModeBar: false }}
          style={{ width: '100%' }}
          useResizeHandler={true}
        />

        <Tooltip title="Download CSV" placement="left" arrow>
          <IconButton onClick={handleDownload} aria-label="Download CSV" sx={cornerButtonSx}>
            <DownloadIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <LoadingOverlay visible={loading} />
      </Box>
    </Box>
  );
};

export default CombinedLinePlot;