import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { nameToLabelMapping, mapGlobeTitleStyle, divergingColors, sequentialColors } from '../constants';
import { generateColorbarTicks } from '../utils';

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
  const readableIndex = nameToLabelMapping[index] || index;
  const readableGroup = group ? ` and ${group}` : '';

  const fullTitle = `${readableIndex}${readableGroup} predicted by ${scenario} on ${model} in ${year}`;

  const generateColorStops = (colorArray) => {
    const step = 1 / colorArray.length;
    const stops = [];

    for (let i = 0; i < colorArray.length; i++) {
      const start = i * step;
      const end = (i + 1) * step;
      stops.push([start, colorArray[i]]);
      stops.push([end, colorArray[i]]);
    }

    return stops;
  };

  const [colorscale, setColorscale] = useState(generateColorStops(sequentialColors));

  const layout = {
    margin: { l: 10, r: 0, t: 60, b: 10 },
    paper_bgcolor: '#282c34',
    plot_bgcolor: '#282c34',
    xaxis: {
      showgrid: false,
      zeroline: false,
      visible: false,
      tickfont: { color: 'white' },
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      visible: false,
      tickfont: { color: 'white' },
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
  };

  const numBins = (colorscale.length / 2);

  const { tickvals, ticktext } = generateColorbarTicks(minValue, maxValue, numBins);

  useEffect(() => {
    const isEnv = sourceType === 'environmental';
    const url = isEnv
      ? `/api/globe-data?source=env&year=${year}&index=${index}&scenario=${scenario}&model=${model}`
      : `/api/map-data?year=${year}&index=${index}&group=${group}&scenario=${scenario}&model=${model}`;

    const isDiverging = index.includes('Change') || index.includes('Temperature');

    if (isDiverging) {
      setColorscale(generateColorStops(divergingColors));
    } else {
      setColorscale(generateColorStops(sequentialColors));
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((json) => {
        setLats(json.lats);
        setLons(json.lons);
        setData(json.variable);
        if (isDiverging) {
          const absMax = Math.max(Math.abs(json.minValue), Math.abs(json.maxValue));
          setMinValue(-absMax);
          setMaxValue(absMax);
        } else {
          setMinValue(json.minValue);
          setMaxValue(json.maxValue);
        }
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching map data:', err);
        setError('Failed to load data');
      });
  }, [year, index, group, scenario, model, sourceType]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#282c34' }}>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* Title Box */}
      <div style={mapGlobeTitleStyle}>
        {fullTitle}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 5,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <Plot
          data={[
            {
              type: 'heatmap',
              z: data,
              x: lons,
              y: lats,
              colorscale: colorscale,
              zsmooth: false,
              zmin: minValue,
              zmax: maxValue,
              hovertemplate: `Longitude: %{x}<br>Latitude: %{y}<br>${index}: %{z}<extra></extra>`,
              colorbar: {
                tickcolor: 'white',
                tickfont: { color: 'white' },
                tickvals: tickvals,
                ticktext: ticktext,
              },
            },
            selectedPoint && {
              type: 'scatter',
              mode: 'text',
              x: [selectedPoint.x],
              y: [selectedPoint.y],
              text: ['📍'],
              textposition: 'middle center',
              textfont: {
                size: 18,
              },
              hoverinfo: 'skip',
            },
          ].filter(Boolean)}
          layout={{
            ...layout,
            autosize: true,
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          onClick={(evt) => {
            if (evt.points?.length > 0) {
              const { x, y } = evt.points[0];
              onPointClick(x, y);
            }
          }}

          config={{ displayModeBar: false, responsive: true }}
        />
      </div>
    </div>
  );
};

export default MapDisplay;
