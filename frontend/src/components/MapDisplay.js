import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const MapDisplay = ({
  year,
  index,
  group,
  scenario,
  model,
  sourceType = 'plankton',
  onPointClick,
}) => {
  // Maps for axis labels 
  const colorbarLabelMapping = {
    'Biomes': 'Biome [INSERT BIOMES LABEL]',
    'Species Richness': 'Species Richness [%]',
    'Hotspots of Change in Diversity': 'Diversity changes [%]',
    'Habitat Suitability Index (HSI)': 'HSI [%]',
    'Change in HSI': 'ΔHSI [%]',
    'Species Turnover': 'Jaccard Index [-]',
    'Temperature': 'Temperature [°C]',
    'Change in Temperature': 'ΔTemperature [Δ°C]',
    'Oxygen': 'Oxygen [mg/L]',
    'Chlorophyll-a Concentration': 'Chlorophyll-a Concentration [log(mg/m³)]',
  };

  const layout = {
    title: {
      text: `Year: ${year}`,
      font: {
        color: 'white',
      },
    },
    margin: { l: 0, r: 0, t: 30, b: 0 },
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

  const [lats, setLats] = useState([]);
  const [lons, setLons] = useState([]);
  const [data, setData] = useState([]);
  const [_, setColorbar] = useState('Viridis');
  const [minValue, setMinValue] = useState(null);
  const [maxValue, setMaxValue] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const isEnv = sourceType === 'environmental';
    const url = isEnv
      ? `/api/globe-data?source=env&year=${year}&index=${index}&scenario=${scenario}&model=${model}`
      : `/api/map-data?year=${year}&index=${index}&group=${group}&scenario=${scenario}&model=${model}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((json) => {
        setLats(json.lats);
        setLons(json.lons);
        setData(json.variable);
        setColorbar(json.colorscale);
        setMinValue(json.minValue);
        setMaxValue(json.maxValue);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching map data:', err);
        setError('Failed to load data');
      });
  }, [year, index, group, scenario, model, sourceType]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {/* WRAP Plot in an absolutely‐positioned container so it can fill parent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
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
              colorscale: [
                [0.0, '#440154'],
                [0.2, '#440154'],
                [0.2, '#3b528b'],
                [0.4, '#3b528b'],
                [0.4, '#21918c'],
                [0.6, '#21918c'],
                [0.6, '#5ec962'],
                [0.8, '#5ec962'],
                [0.8, '#fde725'],
                [1.0, '#fde725'],
              ],
              zsmooth: false,
              zmin: minValue,
              zmax: maxValue,
              hovertemplate: `Longitude: %{x}<br>Latitude: %{y}<br>${index}: %{z}<extra></extra>`,
              colorbar: {
                title: {
                  text: colorbarLabelMapping[index] || '',
                  side: 'right',
                  font: { color: 'white', size: 16 },
                  textangle: 90,
                },
                tickcolor: 'white',
                tickfont: { color: 'white' },
              },
            },
          ]}
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
