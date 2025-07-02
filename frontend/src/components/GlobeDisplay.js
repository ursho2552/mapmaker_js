import React, { useEffect, useState, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { colorbarLabelMapping, mapGlobeTitleStyle } from '../constants';

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
  const [selectedPoint, setSelectedPoint] = useState(null);

  const legendLabel = colorbarLabelMapping[index] || index;

  const readableIndex = colorbarLabelMapping[index] || index;
  const readableGroup = group ? ` and ${group}` : '';
  const fullTitle = `${readableIndex} ${readableGroup} predicted by ${scenario} on ${model} in ${year}`;

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

  const getColorFromBin = useMemo(() => {
    const divergingColors = ['#0000ff', '#ffffff', '#ff0000'];
    const sequentialColors = ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725'];
    const interpolateColor = (color1, color2, ratio) => {
      const hexToRgb = (hex) => {
        const bigint = parseInt(hex.slice(1), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
      };
      const rgbToHex = (r, g, b) =>
        '#' +
        [r, g, b]
          .map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
          })
          .join('');
      const c1 = hexToRgb(color1);
      const c2 = hexToRgb(color2);
      const r = Math.round(c1[0] + (c2[0] - c1[0]) * ratio);
      const g = Math.round(c1[1] + (c2[1] - c1[1]) * ratio);
      const b = Math.round(c1[2] + (c2[2] - c1[2]) * ratio);
      return rgbToHex(r, g, b);
    };

    const colors = index.includes('Change') ? divergingColors : sequentialColors;

    return (value, min, max) => {
      if (isNaN(value) || value == null) return 'rgba(0,0,0,0)';
      if (min === max) return colors[0];

      if (colors.length === 3) {
        const norm = (value - min) / (max - min);
        if (norm <= 0.5) {
          const ratio = norm / 0.5;
          return interpolateColor(colors[0], colors[1], ratio);
        } else {
          const ratio = (norm - 0.5) / 0.5;
          return interpolateColor(colors[1], colors[2], ratio);
        }
      } else {
        const binSize = (max - min) / 5;
        if (value < min + binSize) return colors[0];
        if (value < min + 2 * binSize) return colors[1];
        if (value < min + 3 * binSize) return colors[2];
        if (value < min + 4 * binSize) return colors[3];
        return colors[4];
      }
    };
  }, [index]);

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
                color: getColorFromBin(value, minVal, maxVal),
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

  const labels = useMemo(() => {
    const binSize = (maxValue - minValue) / 5;
    return Array.from({ length: 5 }, (_, i) =>
      Math.round(minValue + i * binSize)
    ).reverse();
  }, [minValue, maxValue]);

  const legendColors = index.includes('Change')
    ? ['#0000ff', '#ffffff', '#ff0000']
    : ['#440154', '#3b528b', '#21918c', '#5ec962', '#fde725'];

  const legendLabels = index.includes('Change')
    ? [minValue.toFixed(2), ((minValue + maxValue) / 2).toFixed(2), maxValue.toFixed(2)]
    : labels.map((l) => l.toFixed(0));

  const handlePointClick = (lng, lat) => {
    setSelectedPoint({ lng, lat });
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
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#282c34',
        }}
      >
        {/* Title */}
        <div
          style={mapGlobeTitleStyle}
          dangerouslySetInnerHTML={{ __html: fullTitle }}
        />

        {error && (
          <div
            style={{ position: 'absolute', top: 0, left: 0, color: 'red', zIndex: 11 }}
          >
            {error}
          </div>
        )}

        {/* Globe */}
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
            htmlElementsData={selectedPoint ? [selectedPoint] : []}
            htmlElement={createHtmlElement}
          />
        </div>

        {/* Legend (Colorbar) */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            right: 10,
            width: 65,
            height: 'calc(100% - 80px)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              height: '90%',
              borderRadius: 4,
              background: index.includes('Change')
                ? 'linear-gradient(to top, #0000ff 0%, #ffffff 50%, #ff0000 100%)'
                : 'none',
            }}
          >
            {!index.includes('Change') &&
              legendColors.map((color, i) => (
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
              marginLeft: 1,
              height: '90%',
              color: 'white',
              fontSize: 12,
              userSelect: 'none',
            }}
          >
            {legendLabels.map((lbl, i) => (
              <div key={i}>{`- ${lbl}`}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

};

export default GlobeDisplay;
