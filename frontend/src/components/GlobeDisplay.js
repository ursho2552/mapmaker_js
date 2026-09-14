import React, { useEffect, useMemo, useRef } from 'react';
import Globe from 'react-globe.gl';
import ColorLegend from './common/ColorLegend';
import FigureBox from './common/FigureBox';
import LoadingOverlay from './common/LoadingOverlay';
import PanelTitle from './common/PanelTitle';
import { fetchGrid } from '../api/client';
import { useAsyncData } from '../hooks/useAsyncData';
import { useElementSize } from '../hooks/useElementSize';
import { EARTH_TEXTURE } from '../constants';
import {
  figureTitle,
  getColorDomainForIndex,
  getColorscaleForIndex,
  getInterpolatedColorFromValue,
  getLegendFromColorscale,
  unitOf,
} from '../utils';
import {
  centerMessageStyle,
  figureArea,
  globeCanvasStyle,
  PLOT_MARGIN,
  surfaceStyle,
  titleStyle,
} from '../styles/display';

// Shared empty array, so the globe does not see "new" points every render.
const NO_POINTS = [];

/** Plot every nth grid cell, to keep the number of globe points manageable. */
const GRID_STEP = 2;

/** Closest and farthest the camera may zoom, in globe radii × 100. */
const MIN_DISTANCE = 250;
const MAX_DISTANCE = 400;

const createPinElement = () => {
  const el = document.createElement('div');
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

const GlobeDisplay = ({
  year,
  index,
  group,
  scenario,
  model,
  sourceType = 'environmental',
  onPointClick,
  selectedPoint,
  registerGlobe,
}) => {
  const [containerRef, { width, height }] = useElementSize();
  const globeRef = useRef();

  // Globe points per selection, so revisiting a year does not refetch it.
  const cacheRef = useRef(new Map());

  const colorscale = useMemo(() => getColorscaleForIndex(index, scenario), [index, scenario]);

  const loadPoints = async (signal) => {
    const cacheKey = `${year}_${index}_${group}_${scenario}_${model}_${sourceType}`;
    const cached = cacheRef.current.get(cacheKey);
    if (cached) return cached;

    const data = await fetchGrid({ sourceType, year, index, group, scenario, model }, signal);

    const finite = data.variable.flat().filter((v) => v != null && Number.isFinite(v));
    const [minValue, maxValue] = getColorDomainForIndex(
      Math.min(...finite),
      Math.max(...finite),
      index,
      scenario
    );

    const pointsData = [];
    for (let latIdx = 0; latIdx < data.lats.length; latIdx += GRID_STEP) {
      for (let lonIdx = 0; lonIdx < data.lons.length; lonIdx += GRID_STEP) {
        const value = data.variable[latIdx][lonIdx];
        if (value == null || Number.isNaN(value)) continue;
        pointsData.push({
          lat: data.lats[latIdx],
          lng: data.lons[lonIdx],
          size: value !== 0 ? 0.01 : 0,
          color: getInterpolatedColorFromValue(value, minValue, maxValue, colorscale),
        });
      }
    }

    const result = { pointsData, minValue, maxValue };
    cacheRef.current.set(cacheKey, result);
    return result;
  };

  const { data: points, loading, error } = useAsyncData(
    loadPoints,
    [year, index, group, scenario, model, sourceType]
  );

  // Limits first, so a camera copied from another globe on registration is kept within them.
  useEffect(() => {
    const controls = globeRef.current?.controls();
    if (!controls) return;
    controls.minDistance = MIN_DISTANCE;
    controls.maxDistance = MAX_DISTANCE;
    controls.autoRotate = false;
  }, []);

  useEffect(() => registerGlobe?.(globeRef.current), [registerGlobe]);

  const pointsData = points?.pointsData ?? NO_POINTS;

  const legend = useMemo(
    () => (points ? getLegendFromColorscale(colorscale, points.minValue, points.maxValue) : null),
    [points, colorscale]
  );

  const pinData = useMemo(
    () => (selectedPoint ? [{ lat: selectedPoint.y, lng: selectedPoint.x }] : NO_POINTS),
    [selectedPoint]
  );

  // The globe is as tall as a map would be in its place.
  const diameter = figureArea(width, height).height;
  const canvasStyle = globeCanvasStyle(width, diameter);

  return (
    <FigureBox>
      <div ref={containerRef} style={surfaceStyle(loading)}>
        <PanelTitle
          title={figureTitle({ index, group, scenario, model, year })}
          loading={loading}
          style={titleStyle}
        />
        <div style={canvasStyle}>
          <Globe
            ref={globeRef}
            width={canvasStyle.width}
            height={canvasStyle.height}
            globeImageUrl={EARTH_TEXTURE}
            showAtmosphere={false}
            backgroundColor="rgba(0,0,0,0)"
            pointsData={pointsData}
            pointAltitude="size"
            pointColor="color"
            pointRadius={0.9}
            pointTransitionDuration={0}
            onPointClick={(pt) => onPointClick?.(pt.lng, pt.lat)}
            htmlElementsData={pinData}
            htmlElement={createPinElement}
          />
        </div>
        <ColorLegend legend={legend} unit={unitOf(index)} top={PLOT_MARGIN.t} height={diameter} />
        {error && <div style={centerMessageStyle('#ff6b6b')}>Failed to load data: {error}</div>}
        <LoadingOverlay visible={loading} />
      </div>
    </FigureBox>
  );
};

export default GlobeDisplay;
