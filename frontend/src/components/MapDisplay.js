import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import Plot from 'react-plotly.js';
import { nameToLabelMapping, mapGlobeTitleStyle, sequentialColors } from '../constants';
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
  onAverageChange,
  selectedPoint,
}) => {
  const [lats, setLats] = useState([]);
  const [lons, setLons] = useState([]);
  const [data, setData] = useState([]);
  const [minValue, setMinValue] = useState(null);
  const [maxValue, setMaxValue] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [colorscale, setColorscale] = useState(generateColorStops(sequentialColors));
  const [zoomRange, setZoomRange] = useState(null);
  const [zoomedAvg, setZoomedAvg] = useState(null);

  // unique key per dataset -> tied to layout.uirevision so Plotly preserves user zoom
  const uiRevisionKey = useMemo(
    () => `${year}-${index}-${group ?? ''}-${scenario}-${model}`,
    [year, index, group, scenario, model]
  );

  // clear zoom state when dataset changes (uirevision will reset the view but our state must follow)
  useEffect(() => {
    setZoomRange(null);
    setZoomedAvg(null);
  }, [uiRevisionKey]);

  // Fetch data
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      try {
        const isEnv = sourceType === 'environmental';
        const url = isEnv
          ? `/api/globe-data?source=env&year=${year}&index=${index}&scenario=${scenario}&model=${model}`
          : `/api/map-data?year=${year}&index=${index}&group=${group}&scenario=${scenario}&model=${model}`;

        setColorscale(getColorscaleForIndex(index, scenario));

        const response = await fetch(url, { signal });
        if (!response.ok) throw new Error('Network response was not ok');

        const json = await response.json();
        setLats(json.lats || []);
        setLons(json.lons || []);
        setData(json.variable || []);

        const [min, max] = getColorDomainForIndex(json.minValue, json.maxValue, index, scenario);
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

  // Memoized colorbar ticks
  const { tickvals, ticktext } = useMemo(() => {
    if (minValue == null || maxValue == null || !colorscale.length) return { tickvals: [], ticktext: [] };
    return generateColorbarTicks(minValue, maxValue, colorscale.length / 2);
  }, [minValue, maxValue, colorscale]);

  // Memoized plot data (heatmap + optional marker)
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
  }, [data, lons, lats, colorscale, minValue, maxValue, tickvals, ticktext, selectedPoint, index]);

  // stable layout: includes uirevision and dragmode so zoom persists across re-renders
  const layout = useMemo(() => ({
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
      tickfont: { color: 'white' }
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      showticklabels: false,
      tickfont: { color: 'white' }
    },
    images: [
      {
        source: '//unpkg.com/three-globe/example/img/earth-water.png',
        xref: 'x',
        yref: 'y',
        x: -180,
        y: 90,
        sizex: 360,
        sizey: 180,
        sizing: 'stretch',
        opacity: 0.5,
        layer: 'below',
      },
    ],
  }), [uiRevisionKey]);

  // robust relayout parser (handles both "xaxis.range" arrays and "xaxis.range[0]" keys)
  const parseRelayoutRanges = (eventData) => {
    // case: xaxis.range as array
    if (Array.isArray(eventData['xaxis.range']) && Array.isArray(eventData['yaxis.range'])) {
      return { x: eventData['xaxis.range'], y: eventData['yaxis.range'] };
    }

    // case: indexed keys (Plotly sometimes emits these)
    const x0 = eventData['xaxis.range[0]'];
    const x1 = eventData['xaxis.range[1]'];
    const y0 = eventData['yaxis.range[0]'];
    const y1 = eventData['yaxis.range[1]'];
    if (x0 !== undefined && x1 !== undefined && y0 !== undefined && y1 !== undefined) {
      return { x: [x0, x1], y: [y0, y1] };
    }

    return null;
  };

  // inside MapDisplay
  const zoomResetRef = useRef(false);

  const handleRelayout = (eventData) => {
    if (eventData['xaxis.autorange'] || eventData['yaxis.autorange']) {
      setZoomRange(null);
      setZoomedAvg(null);
      onAverageChange(null);

      // flag to ignore click immediately after reset
      zoomResetRef.current = true;
      return;
    }

    const ranges = parseRelayoutRanges(eventData);
    if (ranges) setZoomRange(ranges);
  };

  // recompute the average for the visible (zoomed) area
  useEffect(() => {
    if (!zoomRange || !Array.isArray(data) || data.length === 0) return;

    const { x: [xMin, xMax], y: [yMin, yMax] } = zoomRange;
    const values = [];

    // iterate only rows/cols inside the lat/lon range
    for (let i = 0; i < lats.length; i++) {
      const lat = lats[i];
      if (lat < yMin || lat > yMax) continue;
      const row = data[i] || [];
      for (let j = 0; j < lons.length; j++) {
        const lon = lons[j];
        if (lon < xMin || lon > xMax) continue;
        const v = row[j];
        if (typeof v === 'number' && !Number.isNaN(v)) values.push(v);
      }
    }
    const average = values.length ? values.reduce((s, v) => s + v, 0) / values.length : null;
    onAverageChange(average);
    setZoomedAvg(average);
  }, [zoomRange, data, lats, lons]);

  const fullTitle = useMemo(() => {
    const readableIndex = nameToLabelMapping[index] || index;
    const readableGroup = group ? ` and ${group}` : '';
    return `${readableIndex}${readableGroup} predicted by ${scenario} on ${model} in ${year}`;
  }, [index, group, scenario, model, year]);

  const handlePointClick = useCallback((evt) => {
    if (!evt.points?.length) return;
    const { x, y } = evt.points[0];
    if (typeof onPointClick === 'function') onPointClick(x, y);
  }, [onPointClick]);

  return (
    <div style={containerStyle}>
      <div style={mapGlobeTitleStyle}>{fullTitle}</div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && data.length === 0 && (
        <div style={{ color: 'gray' }}>No data available for this selection</div>
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

      {zoomedAvg !== null && (
        <div style={{ color: 'white', marginTop: '4px' }}>
          Avg in zoomed area: {zoomedAvg.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default MapDisplay;