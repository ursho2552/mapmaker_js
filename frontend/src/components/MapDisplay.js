import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const MapDisplay = ({ year, index, group, scenario, model, sourceType = 'plankton', onPointClick }) => {

  const colorbarLabelMapping = {
    'Biomes': 'Biome label',
    'Species Richness': 'Species Richness [%]',
    'Hotspots of Change in Diversity': 'Diversity changes [%]',
    'Habitat Suitability Index (HSI)': 'HSI [%]',
    'Change in HSI': 'ΔHSI [%]',
    'Species Turnover': 'Jaccard Index [-]',
    // Environmental metrics
    'Temperature': '°C',
    'Change in Temperature': 'Δ°C',
    'Oxygen': 'mg/L',
    'Chlorophyll-a Concentration': 'log(mg/m³)',
  };

  const layout = {
    title: {
      text: `Year: ${year}`,
      font: {
        color: 'white',  // Set title text color to white
      },
    },
    margin: { l: 0, r: 0, t: 30, b: 0 },  // Minimized margins to remove white border
    paper_bgcolor: '#282c34',  // Set background color of the plot
    plot_bgcolor: '#282c34',   // Set background color for the plot area
    xaxis: {
      showgrid: false,  // Remove gridlines
      zeroline: false,  // Remove zero line
      visible: false,   // Hide the axis
      tickfont: {
        color: 'white',  // Set x-axis tick labels to white
      },
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      visible: false,
      tickfont: {
        color: 'white',  // Set y-axis tick labels to white
      },
    },
    images: [
      {
        source: "//unpkg.com/three-globe/example/img/earth-water.png", // Example URL for a world map
        xref: "x",
        yref: "y",
        x: -180,
        y: 90,
        sizex: 360,
        sizey: 180,
        sizing: "stretch",
        opacity: 0.5,  // Adjust opacity to make the map more transparent
        layer: "below",  // Ensure the map is behind the heatmap
      },
    ],
  };

  const [lats, setLats] = useState([]);
  const [lons, setLons] = useState([]);
  const [data, setData] = useState([]);
  const [colorbar, setColorbar] = useState('Viridis');
  const [minValue, setMinValue] = useState(null);
  const [maxValue, setMaxValue] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Decide which endpoint to call based on sourceType prop
    const isEnv = sourceType === 'environmental';
    const url = isEnv
      ? `/api/globe-data?source=env&year=${year}&index=${index}&scenario=${scenario}&model=${model}`
      : `/api/map-data?year=${year}&index=${index}&group=${group}&scenario=${scenario}&model=${model}`;
    console.log('Fetching data from', url);
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setLats(data.lats);
        setLons(data.lons);
        setData(data.variable);
        setColorbar(data.colorscale);
        setMinValue(data.minValue);
        setMaxValue(data.maxValue);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching map data:', error);
        setError('Failed to load data');
      });
  }, [year, index, group, scenario, model, sourceType]);

  return (
    <div>
      {error && <div>{error}</div>}
      <Plot
        data={[
          {
            type: 'heatmap',
            z: data,
            x: lons,
            y: lats,
            colorscale: colorbar,
            zmin: minValue,
            zmax: maxValue,
            colorbar: {
              title: {
                text: colorbarLabelMapping[index],
                side: 'right',        // Position the label on the right
                font: {
                  color: 'white',    // Color of the label text
                  size: 16           // Adjust size if needed
                },
                textangle: 90,        // Rotate the label vertically
              },
              tickcolor: 'white',  // Set color of the ticks (labels) to white
              tickfont: {
                color: 'white',    // Set the color of the colorbar labels to white
              },
            },
            zsmooth: 'best',
          }
        ]}
        layout={layout}
        onClick={(event) => {
          if (event.points.length > 0) {
            const { x, y } = event.points[0];
            onPointClick(x, y);
          }
        }}
      />
    </div>
  );
};

export default MapDisplay;
