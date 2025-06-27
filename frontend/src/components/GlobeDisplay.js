import React, { useEffect, useState, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';

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
  const globeRef = useRef();

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [pointsData, setPointsData] = useState([]);
  const [error, setError] = useState(null);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(1);
  const [cachedData, setCachedData] = useState({});
  const [isHovered, setIsHovered] = useState(false);

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

  const legendLabel = colorbarLabelMapping[index] || index;

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const getColorFromBin = useMemo(() => {
    const colors = ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725'];
    return (value, min, max) => {
      if (isNaN(value) || value == null) return 'rgba(0,0,0,0)';
      const binSize = (max - min) / 5;
      if (binSize === 0) return colors[0];
      if (value < min + binSize) return colors[0];
      if (value < min + 2 * binSize) return colors[1];
      if (value < min + 3 * binSize) return colors[2];
      if (value < min + 4 * binSize) return colors[3];
      return colors[4];
    };
  }, []);

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

      const flatData = data.variable.flat();
      const minVal = Math.min(...flatData.filter((v) => !isNaN(v) && v != null));
      const maxVal = Math.max(...flatData.filter((v) => !isNaN(v) && v != null));

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
                color: getColorFromBin(value, minVal, maxVal),
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

  useEffect(() => {
    fetchData(year);
  }, [year, index, group, scenario, model, sourceType]);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().minDistance = 250;
      globeRef.current.controls().maxDistance = 400;
    }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!isHovered && globeRef.current) {
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = 1;
      } else if (globeRef.current) {
        globeRef.current.controls().autoRotate = false;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [isHovered]);

  const labels = useMemo(() => {
    const binSize = (maxValue - minValue) / 5;
    return Array.from({ length: 5 }, (_, i) =>
      Math.round(minValue + i * binSize)
    ).reverse();
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

      <div
        style={{
          position: 'absolute',
          right: 8,
          top: 8,
          bottom: 8,
          width: 60,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            height: '100%',
          }}
        >
          <div
            style={{
              width: 20,
              borderRadius: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725']
              .slice()
              .reverse()
              .map((color, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    backgroundColor: color,
                  }}
                />
              ))}
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginLeft: 8,
            }}
          >
            {labels.map((lbl, i) => (
              <div key={i} style={{ color: 'white', fontSize: '0.8rem' }}>
                {lbl}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            font: { color: 'white', size: 16 },
            whiteSpace: 'nowrap',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            marginTop: 8,
          }}
        >
          {legendLabel}
        </div>
      </div>
    </div>
  );
};

export default GlobeDisplay;
