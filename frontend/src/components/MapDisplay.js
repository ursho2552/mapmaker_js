import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { fetchGrid } from '../api/client';
import { useAsyncData } from '../hooks/useAsyncData';
import {
  EARTH_TEXTURE,
  nameToLabelMapping,
  mapGlobeTitleStyle,
} from '../constants';
import {
  generateColorbarTicks,
  getColorscaleForIndex,
  getColorDomainForIndex,
} from '../utils';

// Shared empty array, so the plot memo does not see a "new" array every render.
const EMPTY = [];

const containerStyle = {
  width: '100%',
  height: '100%',
  position: 'relative',
  backgroundColor: 'rgba(18, 18, 18, 0.6)',
};

const plotWrapperStyle = {
  position: 'absolute',
  top: 5,
  left: 0,
  width: '100%',
  height: '100%',
};

const MapDisplay = ({
  year,
  index,
  group,
  scenario,
  model,
  sourceType = 'plankton',
  onPointClick,
  onZoomedAreaChange,
  selectedPoint,
  selectedArea,
  zoomedArea,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const { data: grid, loading, error } = useAsyncData(
    (signal) => fetchGrid({ sourceType, year, index, group, scenario, model }, signal),
    [sourceType, year, index, group, scenario, model]
  );

  const lats = grid?.lats ?? EMPTY;
  const lons = grid?.lons ?? EMPTY;
  const data = grid?.variable ?? EMPTY;

  const colorscale = useMemo(() => getColorscaleForIndex(index, scenario), [index, scenario]);

  const [minValue, maxValue] = useMemo(
    () => (grid ? getColorDomainForIndex(grid.minValue, grid.maxValue, index, scenario) : [null, null]),
    // The domain belongs to the loaded grid, so it only changes when a new grid arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [grid]
  );

  const uiRevisionKey = useMemo(
    () => `${year}-${index}-${group ?? ''}-${scenario}-${model}`,
    [year, index, group, scenario, model]
  );

  // Reset zoom when dataset changes
  useEffect(() => {
    setIsZoomed(false);
  }, [uiRevisionKey]);

  // Colorbar ticks
  const { tickvals, ticktext } = useMemo(() => {
    if (minValue == null || maxValue == null || !colorscale.length)
      return { tickvals: [], ticktext: [] };
    return generateColorbarTicks(minValue, maxValue, colorscale.length / 2);
  }, [minValue, maxValue, colorscale]);

  // Plot data
  const plotData = useMemo(() => {
    const heatmap = {
      type: 'heatmap',
      z: data,
      x: lons,
      y: lats,
      // Let the Earth texture show through the data.
      opacity: 0.7,
      colorscale,
      zsmooth: false,
      zmin: minValue,
      zmax: maxValue,
      hovertemplate: `Longitude: %{x}<br>Latitude: %{y}<br>${index}: %{z}<extra></extra>`,
      colorbar: {
        tickcolor: 'white',
        tickfont: { color: 'white' },
        tickvals,
        ticktext,
      },
    };

    if (selectedPoint) {
      return [
        heatmap,
        {
          type: 'scatter',
          mode: 'text',
          x: [selectedPoint.x],
          y: [selectedPoint.y],
          text: ['📍'],
          textposition: 'middle center',
          textfont: { size: 18 },
          hoverinfo: 'skip',
        },
      ];
    }
    return [heatmap];
  }, [
    data,
    lons,
    lats,
    colorscale,
    minValue,
    maxValue,
    tickvals,
    ticktext,
    selectedPoint,
    selectedArea,
    index,
    isZoomed,
  ]);

  // Layout
  const layout = useMemo(() => {
    const baseLayout = {
      margin: { l: 10, r: 0, t: 60, b: 10 },
      paper_bgcolor: 'rgba(18, 18, 18, 0.6)',
      plot_bgcolor: 'rgba(18, 18, 18, 0.6)',
      autosize: true,
      uirevision: uiRevisionKey,
      dragmode: 'zoom',
      images: [
        {
          source: EARTH_TEXTURE,
          xref: 'x',
          yref: 'y',
          x: -180,
          y: 90,
          sizex: 360,
          sizey: 180,
          sizing: 'stretch',
          layer: 'below',
        },
      ],
      xaxis: {
        showgrid: false,
        zeroline: false,
        showticklabels: false,
        tickfont: { color: 'white' },
      },
      yaxis: {
        showgrid: false,
        zeroline: false,
        showticklabels: false,
        tickfont: { color: 'white' },
      },
    };

    if (zoomedArea?.x && zoomedArea?.y) {
      baseLayout.xaxis.range = zoomedArea.x;
      baseLayout.yaxis.range = zoomedArea.y;
      baseLayout.xaxis.autorange = false;
      baseLayout.yaxis.autorange = false;
    } else {
      baseLayout.xaxis.autorange = true;
      baseLayout.yaxis.autorange = true;
    }

    return baseLayout;
  }, [uiRevisionKey, zoomedArea]);

  // Parse relayout ranges
  const parseRelayoutRanges = (eventData) => {
    const xr = eventData['xaxis.range'] || [
      eventData['xaxis.range[0]'],
      eventData['xaxis.range[1]'],
    ];
    const yr = eventData['yaxis.range'] || [
      eventData['yaxis.range[0]'],
      eventData['yaxis.range[1]'],
    ];
    if (xr?.[0] != null && xr?.[1] != null && yr?.[0] != null && yr?.[1] != null) {
      return { x: xr, y: yr };
    }
    return null;
  };

  // Handle zoom/relayout
  const handleRelayout = (eventData) => {
    if (eventData['xaxis.autorange'] || eventData['yaxis.autorange']) {
      setIsZoomed(false);
      onZoomedAreaChange?.(null);
      return;
    }

    const ranges = parseRelayoutRanges(eventData);
    if (ranges) {
      setIsZoomed(true);
      onZoomedAreaChange?.(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(ranges)) {
          return ranges;
        }
        return prev;
      });
    }
  };

  // Handle point click
  const handlePointClick = useCallback(
    (evt) => {
      if (!evt.points?.length) return;
      const { x, y } = evt.points[0];
      onPointClick?.(x, y);
    },
    [onPointClick]
  );

  const fullTitle = useMemo(() => {
    const readableIndex = nameToLabelMapping[index] || index;
    const readableGroup = group ? ` and ${group}` : '';
    return `${readableIndex}${readableGroup} predicted by ${scenario} on ${model} in ${year}`;
  }, [index, group, scenario, model, year]);

  return (
    <div style={containerStyle}>
      <div style={mapGlobeTitleStyle}>{fullTitle}</div>
      {error && <div style={{ color: 'red' }}>Failed to load data: {error}</div>}
      {!loading && !error && data.length === 0 && (
        <div style={{ color: 'gray' }}>
          No data available for this selection
        </div>
      )}
      <div style={plotWrapperStyle}>
        <Plot
          data={plotData}
          layout={layout}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
          onRelayout={handleRelayout}
          onClick={handlePointClick}
          config={{
            displayModeBar: false,
            responsive: true,
            displaylogo: false,
            showTips: false,
          }}
        />
      </div>
    </div>
  );
};

export default MapDisplay;