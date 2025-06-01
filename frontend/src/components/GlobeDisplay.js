// GlobeDisplay.js
import React, { useEffect, useState, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as d3 from 'd3-scale-chromatic';
import { scaleSequential } from 'd3-scale';

const GlobeDisplay = ({
  year,
  index,
  group,
  scenario,
  model,
  sourceType = 'environmental',
  onPointClick,
}) => {
  const containerRef = useRef(null);

  // State for container dimensions
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // State for fetched data
  const [pointsData, setPointsData] = useState([]);
  const [error, setError] = useState(null);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(1);
  const [cachedData, setCachedData] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  const globeRef = useRef();

  // Mapping for colorbar label
  const colorbarLabelMapping = {
    Temperature: '°C',
    Oxygen: 'mg/L',
    'Change in Temperature': 'Δ°C',
    'Chlorophyll-a Concentration': 'log(mg/m³)',
  };
  const colorbarLabel = colorbarLabelMapping[index] || '';

  // Resize listener: measure container’s width/height
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

    // Initial measurement
    updateDimensions();

    // Listen to window resize
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Fetch (and cache) data per year
  const fetchData = async (yr) => {
    if (cachedData[yr]) {
      setPointsData(cachedData[yr].pointsData);
      setMinValue(cachedData[yr].minValue);
      setMaxValue(cachedData[yr].maxValue);
      return;
    }

    try {
      const isPlankton = sourceType === 'plankton';
      const params = new URLSearchParams({
        source: isPlankton ? 'plankton' : 'env',
        year: yr.toString(),
        index,
        scenario,
        model,
      });
      if (isPlankton) params.append('group', group);

      const url = `/api/globe-data?${params.toString()}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      // Flatten the 2D variable array to compute min/max
      const flatData = data.variable.flat();
      const minVal = Math.min(...flatData.filter((v) => !isNaN(v) && v != null));
      const maxVal = Math.max(...flatData.filter((v) => !isNaN(v) && v != null));

      // Build pointsData (subsample every other row/col as before)
      const transformed = data.lats
        .filter((_, latIdx) => latIdx % 2 === 0)
        .map((lat, latIdx) => {
          return data.lons
            .filter((_, lonIdx) => lonIdx % 2 === 0)
            .map((lon, lonIdx) => {
              const realLatIdx = latIdx * 2;
              const realLonIdx = lonIdx * 2;
              const value = data.variable[realLatIdx][realLonIdx];
              if (value == null || isNaN(value)) return null;
              return {
                lat,
                lng: lon,
                size: value !== 0 ? 0.01 : 0,
                color: getColorFromViridis(value, minVal, maxVal),
              };
            });
        })
        .flat()
        .filter((p) => p !== null);

      setCachedData((prev) => ({
        ...prev,
        [yr]: { pointsData: transformed, minValue: minVal, maxValue: maxVal },
      }));
      setPointsData(transformed);
      setMinValue(minVal);
      setMaxValue(maxVal);
      setError(null);
    } catch (err) {
      console.error('Error fetching globe data:', err);
      setError('Failed to load data');
    }
  };

  // Memoized Viridis color‐scale function
  const getColorFromViridis = useMemo(() => {
    return (value, min, max) => {
      if (isNaN(value) || value == null) return 'rgba(0,0,0,0)';
      const t = (value - min) / (max - min);
      const scale = scaleSequential(d3.interpolateViridis).domain([0, 1]);
      return scale(t);
    };
  }, []);

  // Whenever year (or any of the dependencies) changes, fetch new data
  useEffect(() => {
    fetchData(year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, index, group, scenario, model, sourceType]);

  // Limit zoom—once globeRef is set
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().minDistance = 250;
      globeRef.current.controls().maxDistance = 400;
    }
  }, []);

  // Auto-rotate logic
  const rotateGlobe = () => {
    if (!isHovered && globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 1;
    } else if (globeRef.current) {
      globeRef.current.controls().autoRotate = false;
    }
  };
  useEffect(() => {
    const frame = requestAnimationFrame(rotateGlobe);
    return () => cancelAnimationFrame(frame);
  }, [isHovered]);

  // Generate a simple 4‐color gradient for a CSS colorbar
  const generateColorbarGradient = () => {
    const steps = 4;
    const stops = Array.from({ length: steps }, (_, i) => {
      const v = i / (steps - 1);
      return getColorFromViridis(minValue + v * (maxValue - minValue), minValue, maxValue);
    });
    return `linear-gradient(to top, ${stops.join(', ')})`;
  };

  const labels = React.useMemo(() => {
    const count = 5;
    const range = maxValue - minValue;
    if (count < 2 || range === 0) return [Math.round(minValue), Math.round(maxValue)];
    const step = range / (count - 1);
    return Array.from({ length: count }, (_, i) => Math.round(minValue + i * step));
  }, [minValue, maxValue]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {error && (
        <div style={{ position: 'absolute', top: 0, left: 0, color: 'red', zIndex: 2 }}>
          {error}
        </div>
      )}

      <div style={{ width: '100%', height: '100%' }}>
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-water.png"
          showAtmosphere={false}
          backgroundColor="#282c34"
          pointsData={pointsData}
          pointAltitude="size"
          pointColor="color"
          pointRadius={0.9}
          onPointClick={(pt) => onPointClick(pt.lng, pt.lat)}
        />
      </div>

      {/* Colorbar on the side */}
      <div
        style={{
          position: 'absolute',
          right: 8,
          top: 8,
          bottom: 8,
          width: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Gradient stripe */}
        <div
          style={{
            flex: 1,
            background: generateColorbarGradient(),
            borderRadius: 4,
            marginBottom: 8,
          }}
        />
        {/* Numeric labels */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          {labels.slice().reverse().map((lbl, i) => (
            <div key={i} style={{ color: 'white', fontSize: '0.8rem' }}>
              {lbl}
            </div>
          ))}
        </div>
        {/* Title below */}
        <div
          style={{
            textAlign: 'center',
            color: 'white',
            fontSize: '0.8rem',
            marginTop: 4,
          }}
        >
          {colorbarLabel}
        </div>
      </div>
    </div>
  );
};

export default GlobeDisplay;

