import React, { useEffect, useState, useMemo } from 'react';
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

  // Memoized readable title
  const fullTitle = useMemo(() => {
    const readableIndex = nameToLabelMapping[index] || index;
    const readableGroup = group ? ` and ${group}` : '';
    return `${readableIndex}${readableGroup} predicted by ${scenario} on ${model} in ${year}`;
  }, [index, group, scenario, model, year]);

  // Memoized colorbar ticks
  const { tickvals, ticktext } = useMemo(() => {
    if (minValue == null || maxValue == null || !colorscale.length) return { tickvals: [], ticktext: [] };
    return generateColorbarTicks(minValue, maxValue, colorscale.length / 2);
  }, [minValue, maxValue, colorscale]);

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

  // Memoized Plot data
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

  const layout = {
    margin: { l: 10, r: 0, t: 60, b: 10 },
    paper_bgcolor: 'rgba(18, 18, 18, 0.6)',
    plot_bgcolor: 'rgba(18, 18, 18, 0.6)',
    xaxis: { showgrid: false, zeroline: false, visible: false, tickfont: { color: 'white' } },
    yaxis: { showgrid: false, zeroline: false, visible: false, tickfont: { color: 'white' } },
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
  };

  return (
    <div style={containerStyle}>

      {/* Title */}
      <div style={mapGlobeTitleStyle}>{fullTitle}</div>

      {/* Error / No Data */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && data.length === 0 && (
        <div style={{ color: 'gray' }}>No data available for this selection</div>
      )}

      {/* Plot */}
      <div style={plotWrapperStyle}>
        <Plot
          data={plotData}
          layout={{ ...layout, autosize: true }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          onClick={(evt) => {
            if (evt.points?.length > 0) {
              const { x, y } = evt.points[0];
              onPointClick(x, y);
            }
          }}
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