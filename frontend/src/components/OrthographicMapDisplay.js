import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const OrthographicMapDisplay = ({ year, onPointClick }) => {
  const [error, setError] = useState(null);
  const [plotData, setPlotData] = useState(null);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(1);

  useEffect(() => {
    console.log('Fetching orthographic map data for year:', year);
    fetch(`http://127.0.0.1:5000/map-data?year=${year}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        const flatData = data.variable.flat();
        const minVal = Math.min(...flatData);
        const maxVal = Math.max(...flatData);
        setMinValue(minVal);
        setMaxValue(maxVal);

        // Prepare scattergeo data points for each lat/lon
        const scatterData = [];
        data.lats.forEach((lat, latIndex) => {
          data.lons.forEach((lon, lonIndex) => {
            const value = data.variable[latIndex][lonIndex];
            scatterData.push({
              lon: lon,
              lat: lat,
              z: value, // Data value for the color
            });
          });
        });

        setPlotData(scatterData);
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching orthographic map data:', error);
        setError('Failed to load data');
      });
  }, [year]);

  return (
    <div className="orthographic-map-container">
      {error && <div>{error}</div>}
      {plotData && (
        <Plot
          data={[
            {
              type: 'scattergeo',
              mode: 'markers',
              lon: plotData.map((d) => d.lon), // Longitude points
              lat: plotData.map((d) => d.lat), // Latitude points
              marker: {
                size: 8, // Adjust marker size for better visibility
                color: plotData.map((d) => d.z), // Color points by data values
                colorscale: 'Viridis',
                cmin: minValue,
                cmax: maxValue,
                colorbar: {
                  title: 'Value',
                },
              },
            },
          ]}
          layout={{
            title: `Global Data (Year: ${year}) - Orthographic Projection`,
            geo: {
              projection: {
                type: 'orthographic', // Proper orthographic projection
              },
              showland: true,
              landcolor: 'rgb(204, 204, 204)',
              oceancolor: 'rgb(28, 107, 160)',
              showocean: true,
              coastlinecolor: 'rgb(255, 255, 255)',
              showcoastlines: true,
              showframe: false,
              showcountries: true,
              resolution: 50,
              projectionrotation: {
                lon: -100, // Adjust this for different initial views
                lat: 40,   // Adjust to move the map vertically
              },
              dragmode: 'orbit', // Enables rotation of the globe
            },
            margin: { t: 50, b: 50, l: 50, r: 50 }, // Adjust margins for better layout
          }}
          config={{
            responsive: true,
            scrollZoom: false, // Disable scroll zoom to prevent unintentional zooming
            dragmode: 'orbit', // Enable globe rotation with dragging
          }}
          onClick={(event) => {
            const { points } = event;
            if (points.length > 0) {
              const { lon, lat } = points[0];
              onPointClick(lon, lat); // Trigger onPointClick when a point is clicked
            }
          }}
        />
      )}
    </div>
  );
};

export default OrthographicMapDisplay;
