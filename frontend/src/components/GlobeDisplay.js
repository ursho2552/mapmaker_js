import React, { useEffect, useState, useMemo, useRef } from 'react';
import Globe from 'react-globe.gl';
import * as d3 from 'd3-scale-chromatic';
import { scaleSequential } from 'd3-scale';

const GlobeDisplay = ({ year, index, group, scenario, model, sourceType = 'environmental', onPointClick }) => {
  const [pointsData, setPointsData] = useState([]);
  const [error, setError] = useState(null);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(1);
  const [cachedData, setCachedData] = useState({});
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  const globeRef = useRef(); // Reference to the Globe component
  // Define a mapping for the colorbar label based on the selected index
  const colorbarLabelMapping = {
    'Temperature': '°C',
    'Oxygen': 'mg/L',
    'Change in Temperature': 'Δ°C',
    'Chlorophyll-a Concentration': 'log(mg/m³)',
  };

  const colorbarLabel = colorbarLabelMapping[index] || ''; // Get the label based on the selected index


  // Fetch data and cache it by year
  const fetchData = async (year) => {
    if (cachedData[year]) {
      setPointsData(cachedData[year].pointsData);
      setMinValue(cachedData[year].minValue);
      setMaxValue(cachedData[year].maxValue);
      return;
    }

    console.log('Fetching globe data for year:', year);
    try {
      // Build URL based on sourceType: 'plankton' or 'environmental'
      const isPlankton = sourceType === 'plankton';
      const params = new URLSearchParams({
        source: isPlankton ? 'plankton' : 'env',
        year: year.toString(),
        index,
        scenario,
        model
      });
      if (isPlankton) params.append('group', group);
      const url = `/api/globe-data?${params.toString()}`;
      console.log('Fetching globe data from', url);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const flatData = data.variable.flat();
      const minVal = Math.min(...flatData);
      const maxVal = Math.max(...flatData);
      setMinValue(minVal);
      setMaxValue(maxVal);

      const transformedData = data.lats
        .filter((_, latIndex) => latIndex % 2 === 0)
        .map((lat, latIndex) => {
          return data.lons
            .filter((_, lonIndex) => lonIndex % 2 === 0)
            .map((lon, lonIndex) => {
              const realLatIndex = latIndex * 2;
              const realLonIndex = lonIndex * 2;
              const value = data.variable[realLatIndex][realLonIndex];

              // Filter out NaN values and missing data
              if (isNaN(value) || value === null) {
                return null;
              }

              return {
                lat: lat,
                lng: lon,
                size: value !== 0 && value !== null ? 0.01 : 0,
                color: getColorFromViridis(value, minVal, maxVal),
              };
            });
        })
        .flat()
        .filter((point) => point !== null); // Filter out null points

      setCachedData((prevCache) => ({
        ...prevCache,
        [year]: { pointsData: transformedData, minValue: minVal, maxValue: maxVal },
      }));

      setPointsData(transformedData);
      setError(null);
    } catch (error) {
      console.error('Error fetching globe data:', error);
      setError('Failed to load data');
    }
  };

  useEffect(() => {
    // Reload globe data when year, data params, or sourceType change
    fetchData(year);
  }, [year, index, group, scenario, model, sourceType]);

  // Viridis color scale function
  const getColorFromViridis = useMemo(() => {
    return (value, min, max) => {
      if (isNaN(value) || value === null) {
        return 'rgba(0, 0, 0, 0)'; // Transparent for NaN or missing values
      }
      const normalizedValue = (value - min) / (max - min);
      const viridisScale = scaleSequential(d3.interpolateViridis).domain([0, 1]);
      return viridisScale(normalizedValue);
    };
  }, []);

  // Limit zoom range
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().minDistance = 250; // Set the minimum zoom distance
      globeRef.current.controls().maxDistance = 400; // Set the maximum zoom distance
    }
  }, []);

  // Auto-rotate logic
  const rotateGlobe = () => {
    if (!isHovered && globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 1; // Adjust rotation speed
    } else if (globeRef.current) {
      globeRef.current.controls().autoRotate = false; // Stop rotation on hover
    }
  };

  useEffect(() => {
    const animationId = requestAnimationFrame(rotateGlobe);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

  // Generate colorbar gradient
  const generateColorbarGradient = () => {
    const steps = 4;
    const colorStops = Array.from({ length: steps }, (_, i) => {
      const value = i / (steps - 1);
      return getColorFromViridis(minValue + value * (maxValue - minValue), minValue, maxValue);
    });
    return `linear-gradient(to top, ${colorStops.join(', ')})`;
  };

  // Generate colorbar labels
  const generateColorbarLabels = () => {
    const labelCount = 5;
    const range = maxValue - minValue;
    const stepSize = Math.round(range / (labelCount - 1));

    return Array.from({ length: labelCount }, (_, i) => Math.round(minValue + i * stepSize));
  };

  const labels = generateColorbarLabels();

  return (
    <div
      className="globe-display-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {error && <div>{error}</div>}
      <div className="globe-container">
        <Globe
          ref={globeRef}
          width={500}
          height={500}
          // globeImageUrl={null}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-water.png"
          showAtmosphere={false}
          pointsData={pointsData}
          pointAltitude="size"
          pointColor="color"
          pointRadius={0.9}
          // onPointClick={null}
          onPointClick={(point) => onPointClick(point.lng, point.lat)}
          backgroundColor="#282c34"
          // backgroundColor="rgba(0, 0, 0, 0)"
        />
      </div>
      <div className="colorbar-container">
        <div className="colorbar" style={{ background: generateColorbarGradient() }} />
        <div className="colorbar-labels">
          {labels.map((label, index) => (
            <div key={index} className="colorbar-label">
              {label}
            </div>
          ))}
        </div>
        {/* Display the colorbar label */}
        <div className="colorbar-title" style={{ color: 'white', textAlign: 'center', marginTop: '10px' }}>
          {colorbarLabel}
        </div>
      </div>
    </div>
  );
};

export default GlobeDisplay;
