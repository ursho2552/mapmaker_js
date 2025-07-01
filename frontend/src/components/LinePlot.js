import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const LinePlot = ({ selectedPoint, startYear, endYear, index, group, scenario, model, envParam }) => {

  const layout = {
    title: `${selectedPoint.x}°E/${selectedPoint.y}°N from ${startYear} to ${endYear}`,
    font: {
      color: 'white',
    },
    margin: { l: 50, r: 70, t: 30, b: 30 },
    paper_bgcolor: '#282c34',
    plot_bgcolor: '#282c34',
    xaxis: { title: 'Year' },
    yaxis: { title: yAxisLabelMapping[index] },
    yaxis2: {
      title: envParamLabelMapping[envParam],
      overlaying: 'y',
      side: 'right',
      showgrid: true,
    },
    legend: {
      x: 1.05,
      y: 1,
      xanchor: 'left',
      yanchor: 'top',
      bgcolor: 'rgba(0,0,0,0)',
      font: {
        color: 'white'
      }
    }
  };


  const [lineData, setLineData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedPoint.x !== null && selectedPoint.y !== null) {
      fetch(`/api/line-data?x=${selectedPoint.x}&y=${selectedPoint.y}&startYear=${startYear}&endYear=${endYear}&index=${index}&group=${group}&scenario=${scenario}&model=${model}&envParam=${envParam}`)
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
  }, [selectedPoint, startYear, endYear, index, group, scenario, model, envParam]);

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
              ...lineData.data[0],
              name: index,
              yaxis: 'y'
            },
            {
              ...lineData.data[2],
              name: index + ' Trend',
              yaxis: 'y'
            },
            {
              ...lineData.data[1],
              name: envParam,
              yaxis: 'y2'
            },
            {
              ...lineData.data[3],
              name: envParam + ' Trend',
              yaxis: 'y2'
            }
          ]}
          layout={layout}
          config={{ displayModeBar: false }}
          useResizeHandler={true}
          style={{ width: '100%', height: '80%' }}

        />
      )}
    </div>
  );
};

export default LinePlot;
