import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';


const LinePlot = ({ selectedPoint, startYear, endYear, index, group, scenario, model, envParam }) => {

  const yAxisLabelMapping = {
    'Biomes': 'Biome label',
    'Species Richness': 'Species Richness [%]',
    'Hotspots of Change in Diversity': 'Diversity changes [%]',
    'Habitat Suitability Index (HSI)': 'HSI [%]',
    'Change in HSI': 'ΔHSI [%]',
    'Species Turnover': 'Jaccard Index [-]',
  };

  const envParamLabelMapping = {
    'Temperature': '°C',
    'Oxygen': 'ml/l',
    'Change in Temperature': 'Δ°C',
    'Chlorophyll-a Concentration': 'log(mg/m³)',
  };

  const layout = {
    title: `${selectedPoint.x}°E/${selectedPoint.y}°N from ${startYear} to ${endYear}`,
    font: {
      color: 'white',  // Set title text color to white
    },
    margin: { l: 50, r: 70, t: 30, b: 30 },  // Increased right margin to 70
    paper_bgcolor: '#282c34',  // Set background color of the plot
    plot_bgcolor: '#282c34',   // Set background color for the plot area
    xaxis: { title: 'Year' },
    yaxis: { title: yAxisLabelMapping[index] },
    yaxis2: {  // Add the second Y-axis
      title: envParamLabelMapping[envParam],  // Replace with the appropriate label
      overlaying: 'y',
      side: 'right',
      showgrid: true,
    },
    legend: {
      x: 1.05,  // Move legend outside the plot to the right
      y: 1,
      xanchor: 'left',
      yanchor: 'top',
      bgcolor: 'rgba(0,0,0,0)',  // Transparent background for the legend
      font: {
        color: 'white'
      }
    }
  };


  const [lineData, setLineData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedPoint.x !== null && selectedPoint.y !== null) {
      fetch(`http://127.0.0.1:5000/line-data?x=${selectedPoint.x}&y=${selectedPoint.y}&startYear=${startYear}&endYear=${endYear}&index=${index}&group=${group}&scenario=${scenario}&model=${model}&envParam=${envParam}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Line plot data received:', data);
          setLineData(data);
        })
        .catch(error => {
          console.error('Error fetching line plot data:', error);
          setError(error.message);
        });
    }
  }, [selectedPoint, startYear, endYear, index, group, scenario, model, envParam]); // Update whenever selectedPoint or years change

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* <h2>Line Plot for Point ({selectedPoint.x}, {selectedPoint.y}) from {startYear} to {endYear}:</h2> */}
      {lineData && (
        <Plot
        data={[
          {
            ...lineData.data[0],  // Trace for the first line (left Y-axis)
            name: index,  // Name based on the index
            // line: { color: 'white' },
            yaxis: 'y'  // Assign to the left Y-axis
          },
          {
            ...lineData.data[2],  // Trace for the first line (left Y-axis)
            name: index + ' Trend',  // Name based on the index
            // line: { color: 'white' },
            yaxis: 'y'  // Assign to the left Y-axis
          },
          {
            ...lineData.data[1],  // Trace for the second line (right Y-axis)
            name: envParam,  // Name based on the environmental parameter
            // line: { color: color },  // Different color for the second line
            yaxis: 'y2'  // Assign to the right Y-axis
          },
          {
            ...lineData.data[3],  // Trace for the second line (right Y-axis)
            name: envParam + ' Trend',  // Name based on the environmental parameter
            // line: { color: color },  // Different color for the second line
            yaxis: 'y2'  // Assign to the right Y-axis
          }
        ]}
          layout={layout}
        config={{ displayModeBar: false }} // Hide the mode bar
        useResizeHandler={true}
        style={{ width: '100%', height: '80%' }} // Ensure it uses full container space

        />
      )}
    </div>
  );
};

export default LinePlot;
