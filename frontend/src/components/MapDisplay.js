import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import {
  nameToLabelMapping,
  mapGlobeTitleStyle,
  sequentialColors,
} from '../constants';
import {
  generateColorStops,
  generateColorbarTicks,
  getColorscaleForIndex,
  getColorDomainForIndex,
} from '../utils';

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
  selectedArea
}) => {
  const [lats, setLats] = useState([]);
  const [lons, setLons] = useState([]);
  const [data, setData] = useState([]);
  const [minValue, setMinValue] = useState(null);
  const [maxValue, setMaxValue] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [colorscale, setColorscale] = useState(generateColorStops(sequentialColors));
  const [isZoomed, setIsZoomed] = useState(false);

  const uiRevisionKey = useMemo(
    () => `${year}-${index}-${group ?? ''}-${scenario}-${model}`,
    [year, index, group, scenario, model]
  );

  // Reset zoom when dataset changes
  useEffect(() => {
    setIsZoomed(false);
  }, [uiRevisionKey]);

  // Fetch data
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      try {
        const url =
          sourceType === 'environmental'
            ? `/api/globe-data?source=env&year=${year}&index=${index}&scenario=${scenario}&model=${model}`
            : `/api/map-data?year=${year}&index=${index}&group=${group}&scenario=${scenario}&model=${model}`;

        setColorscale(getColorscaleForIndex(index, scenario));

        const response = await fetch(url, { signal });
        if (!response.ok) throw new Error('Network response was not ok');

        const json = await response.json();
        setLats(json.lats || []);
        setLons(json.lons || []);
        setData(json.variable || []);

        const [min, max] = getColorDomainForIndex(
          json.minValue,
          json.maxValue,
          index,
          scenario
        );
        setMinValue(min);
        setMaxValue(max);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching map data:', err);
          setError('Failed to load data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [year, index, group, scenario, model, sourceType]);

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

    if (!isZoomed && selectedPoint) {
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
  const layout = useMemo(
    () => ({
      margin: { l: 10, r: 0, t: 60, b: 10 },
      paper_bgcolor: 'rgba(18, 18, 18, 0.6)',
      plot_bgcolor: 'rgba(18, 18, 18, 0.6)',
      autosize: true,
      uirevision: uiRevisionKey,
      dragmode: 'zoom',
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
    }),
    [uiRevisionKey]
  );

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
      onZoomedAreaChange?.(ranges);
    }
  };

  // Handle point click only when not zoomed
  const handlePointClick = useCallback(
    (evt) => {
      if (isZoomed) return;
      if (!evt.points?.length) return;
      const { x, y } = evt.points[0];
      onPointClick?.(x, y);
    },
    [onPointClick, isZoomed]
  );

  const fullTitle = useMemo(() => {
    const readableIndex = nameToLabelMapping[index] || index;
    const readableGroup = group ? ` and ${group}` : '';
    return `${readableIndex}${readableGroup} predicted by ${scenario} on ${model} in ${year}`;
  }, [index, group, scenario, model, year]);

  return (
    <div style={containerStyle}>
      <div style={mapGlobeTitleStyle}>{fullTitle}</div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
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