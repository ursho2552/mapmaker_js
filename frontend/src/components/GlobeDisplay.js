import React, { useEffect, useState, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { generateColorStops, getInterpolatedColorFromValue, generateColorbarTicks } from '../utils';
import {
  nameToLabelMapping,
  mapGlobeTitleStyle,
  divergingColors,
  sequentialColors,
} from '../constants';

const GlobeDisplay = ({
  year,
  index,
  group,
  scenario,
  model,
  sourceType = 'environmental',
  onPointClick,
  selectedPoint,
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

  const readableIndex = nameToLabelMapping[index] || index;
  const readableGroup = group ? ` and ${group}` : '';
  const fullTitle = `${readableIndex}${readableGroup} predicted by ${scenario} on ${model} in ${year}`;
  const normalizedSelectedPoint = selectedPoint
    ? { lat: selectedPoint.y, lng: selectedPoint.x }
    : null;

  const getDynamicPrecision = (range) => {
    if (range === 0) return 2;
    const magnitude = Math.log10(Math.abs(range));
    if (magnitude >= 3) return 0;
    if (magnitude >= 2) return 1;
    if (magnitude >= 0) return 2;
    if (magnitude >= -2) return 3;
    return 4;
  };

  const isDiverging = useMemo(() => {
    return index.includes('Change') || index.includes('Temperature');
  }, [index]);

  const colorscale = useMemo(() => {
    return generateColorStops(isDiverging ? divergingColors : sequentialColors);
  }, [isDiverging]);

  const createHtmlElement = (d) => {
    const el = document.createElement('div');
    el.style.color = 'red';
    el.style.fontSize = '24px';
    el.style.pointerEvents = 'none';
    el.style.userSelect = 'none';
    el.style.transform = 'translate(-50%, -100%)';
    el.style.whiteSpace = 'nowrap';
    el.setAttribute('aria-label', 'Selected Point Pin');
    el.setAttribute('title', 'Selected Point');
    el.textContent = '📍';
    return el;
  };

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

  const getColorFromValue = useMemo(() => {
    return (value, min, max) => {
      if (isNaN(value) || value == null) return 'rgba(0,0,0,0)';
      if (min === max) return isDiverging ? divergingColors[1] : sequentialColors[0];

      if (isDiverging) {
        const mid = (min + max) / 2;
        return value <= mid ? divergingColors[0] : divergingColors[1];
      } else {
        const binSize = (max - min) / 5;
        if (value < min + binSize) return sequentialColors[0];
        if (value < min + 2 * binSize) return sequentialColors[1];
        if (value < min + 3 * binSize) return sequentialColors[2];
        if (value < min + 4 * binSize) return sequentialColors[3];
        return sequentialColors[4];
      }
    };
  }, [index, isDiverging]);

  const fetchData = async (yr) => {
    const cacheKey = `${yr}_${index}_${group}_${scenario}_${model}_${sourceType}`;

    if (cachedData[cacheKey]) {
      setPointsData(cachedData[cacheKey].pointsData);
      setMinValue(cachedData[cacheKey].minValue);
      setMaxValue(cachedData[cacheKey].maxValue);
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
                color: getInterpolatedColorFromValue(value, minVal, maxVal, colorscale),
              };
            });
        })
        .flat()
        .filter((p) => p !== null);

      setCachedData((prev) => ({
        ...prev,
        [cacheKey]: { pointsData: transformed, minValue: minVal, maxValue: maxVal },
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

  const legendData = useMemo(() => {
    const precision = getDynamicPrecision(maxValue - minValue);
    const n = colorscale.length;

    if (minValue === maxValue) {
      const singleColor = getColorFromValue(minValue, minValue, maxValue);
      return { colors: [singleColor], labels: [minValue.toFixed(precision)] };
    }

    const labels = [];
    for (let i = 0; i <= n; i++) {
      const val = minValue + ((maxValue - minValue) * i) / n;
      labels.push(val.toFixed(precision));
    }

    const colors = colorscale.map((stop) => Array.isArray(stop) ? stop[1] : stop);

    return { colors, labels };
  }, [minValue, maxValue, colorscale, getColorFromValue]);


  const handlePointClick = (lng, lat) => {
    if (onPointClick) onPointClick(lng, lat);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#282c34',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#282c34',
        }}
      >
        <div style={mapGlobeTitleStyle} dangerouslySetInnerHTML={{ __html: fullTitle }} />

        {error && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              color: 'red',
              zIndex: 11,
            }}
          >
            {error}
          </div>
        )}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
              onPointClick={(pt) => handlePointClick(pt.lng, pt.lat)}
              htmlElementsData={normalizedSelectedPoint ? [normalizedSelectedPoint] : []}
              htmlElement={createHtmlElement}
            />
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 60,
            right: 10,
            width: 90,
            height: 'calc(100% - 80px)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {/* Color bins */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column-reverse',
              height: '90%',
              borderRadius: 4,
              background: 'none',
            }}
          >
            {legendData.colors.map((color, i) => (
              <div
                key={i}
                style={{
                  flex: 2 / colorscale.length,
                  backgroundColor: color,
                }}
              />
            ))}
          </div>

          {/* Labels */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column-reverse',
              height: '90%',
              borderRadius: 4,
              background: 'none',
            }}
          >
            {legendData.labels.map((lbl, i) => (
              <div
                key={i}
                style={{
                  flex: 2 / colorscale.length,
                  color: 'white',
                  fontSize: 13,
                }}
              >
                {`- ${lbl}`}
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeDisplay;