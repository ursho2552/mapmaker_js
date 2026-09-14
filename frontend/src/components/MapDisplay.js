import React, { useCallback, useMemo } from 'react';
import Plot from './Plot';
import LoadingOverlay from './common/LoadingOverlay';
import PanelTitle from './common/PanelTitle';
import ZoomHint from './common/ZoomHint';
import { fetchGrid } from '../api/client';
import { useAsyncData } from '../hooks/useAsyncData';
import { useElementSize } from '../hooks/useElementSize';
import { EARTH_TEXTURE } from '../constants';
import {
  figureTitle,
  generateColorbarTicks,
  getColorDomainForIndex,
  getColorscaleForIndex,
  unitOf,
} from '../utils';
import {
  aspectBoxStyle,
  centerMessageStyle,
  colorbarBase,
  colorbarUnitTitle,
  hoverLabel,
  PLOT_MARGIN,
  surfaceStyle,
  titleStyle,
} from '../styles/display';

// Shared empty array, so the plot memo does not see a "new" array every render.
const EMPTY = [];

const HIDDEN_AXIS = {
  showgrid: false,
  zeroline: false,
  showline: false,
  ticks: '',
  showticklabels: false,
};

// Double-click resets the shared zoom through `onDoubleClick` instead of Plotly's own reset.
const PLOT_CONFIG = {
  responsive: true,
  displayModeBar: false,
  displaylogo: false,
  doubleClick: false,
  showTips: false,
};

const plotStyle = { width: '100%', height: '100%' };

/**
 * Equirectangular map: one degree of latitude is as long as one of longitude, so
 * the world is always 2:1, however the panel is sized or zoomed. The plot area
 * shrinks to fit, centred in the figure.
 */
const EQUAL_SCALE_X = { constrain: 'domain' };
const EQUAL_SCALE_Y = { scaleanchor: 'x', scaleratio: 1, constrain: 'domain' };

/** Height of the map in pixels within a figure of the given size, at the full 360° × 180° extent. */
const mapHeight = (width, height) => {
  const plotWidth = width - PLOT_MARGIN.l - PLOT_MARGIN.r;
  const plotHeight = height - PLOT_MARGIN.t - PLOT_MARGIN.b;
  return Math.max(0, Math.min(plotHeight, plotWidth / 2));
};

const parseRelayoutRanges = (eventData) => {
  const x = eventData['xaxis.range'] || [eventData['xaxis.range[0]'], eventData['xaxis.range[1]']];
  const y = eventData['yaxis.range'] || [eventData['yaxis.range[0]'], eventData['yaxis.range[1]']];
  if (x?.[0] != null && x?.[1] != null && y?.[0] != null && y?.[1] != null) {
    return { x, y };
  }
  return null;
};

const MapDisplay = ({
  year,
  index,
  group,
  scenario,
  model,
  sourceType = 'plankton',
  onPointClick,
  onZoomedAreaChange,
  selectedPoint,
  zoomedArea,
}) => {
  const [surfaceRef, { width, height }] = useElementSize();

  const { data: grid, loading, error } = useAsyncData(
    (signal) => fetchGrid({ sourceType, year, index, group, scenario, model }, signal),
    [sourceType, year, index, group, scenario, model]
  );

  const lats = grid?.lats ?? EMPTY;
  const lons = grid?.lons ?? EMPTY;
  const data = grid?.variable ?? EMPTY;

  const colorscale = useMemo(() => getColorscaleForIndex(index, scenario), [index, scenario]);

  const [minValue, maxValue] = useMemo(
    () => (grid ? getColorDomainForIndex(grid.minValue, grid.maxValue, index, scenario) : [null, null]),
    // The domain belongs to the loaded grid, so it only changes when a new grid arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [grid]
  );

  const uiRevisionKey = `${year}-${index}-${group ?? ''}-${scenario}-${model}`;

  const { tickvals, ticktext } = useMemo(() => {
    if (minValue == null || maxValue == null || !colorscale.length) {
      return { tickvals: [], ticktext: [] };
    }
    return generateColorbarTicks(minValue, maxValue, colorscale.length / 2);
  }, [minValue, maxValue, colorscale]);

  // The colour bar matches the map's height rather than the whole plot area's.
  const colorbarLength = mapHeight(width, height);

  const plotData = useMemo(() => {
    const heatmap = {
      type: 'heatmap',
      z: data,
      x: lons,
      y: lats,
      // Let the Earth texture show through the data.
      opacity: 0.7,
      colorscale,
      zsmooth: false,
      zmin: minValue,
      zmax: maxValue,
      hovertemplate: `Longitude: %{x}<br>Latitude: %{y}<br>${index}: %{z}<extra></extra>`,
      hoverlabel: hoverLabel,
      colorbar: {
        ...colorbarBase,
        ...(colorbarLength > 0 && { lenmode: 'pixels', len: colorbarLength }),
        tickvals,
        ticktext,
        ...colorbarUnitTitle(unitOf(index)),
      },
    };

    if (!selectedPoint) return [heatmap];

    return [
      heatmap,
      {
        type: 'scatter',
        mode: 'text',
        x: [selectedPoint.x],
        y: [selectedPoint.y],
        text: ['📍'],
        textposition: 'middle center',
        textfont: { size: 18 },
        hoverinfo: 'skip',
      },
    ];
  }, [data, lons, lats, colorscale, minValue, maxValue, tickvals, ticktext, selectedPoint, index, colorbarLength]);

  const layout = useMemo(() => {
    const zoomed = Boolean(zoomedArea?.x && zoomedArea?.y);
    return {
      margin: PLOT_MARGIN,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      autosize: true,
      uirevision: uiRevisionKey,
      dragmode: 'zoom',
      images: [
        {
          source: EARTH_TEXTURE,
          xref: 'x',
          yref: 'y',
          x: -180,
          y: 90,
          sizex: 360,
          sizey: 180,
          sizing: 'stretch',
          layer: 'below',
        },
      ],
      xaxis: { ...HIDDEN_AXIS, ...EQUAL_SCALE_X, autorange: !zoomed, range: zoomed ? zoomedArea.x : undefined },
      yaxis: { ...HIDDEN_AXIS, ...EQUAL_SCALE_Y, autorange: !zoomed, range: zoomed ? zoomedArea.y : undefined },
    };
  }, [uiRevisionKey, zoomedArea]);

  const resetZoom = useCallback(() => onZoomedAreaChange?.(null), [onZoomedAreaChange]);

  const handleRelayout = (eventData) => {
    if (eventData['xaxis.autorange'] || eventData['yaxis.autorange']) {
      onZoomedAreaChange?.(null);
      return;
    }

    const ranges = parseRelayoutRanges(eventData);
    if (ranges) {
      onZoomedAreaChange?.((prev) =>
        JSON.stringify(prev) !== JSON.stringify(ranges) ? ranges : prev
      );
    }
  };

  const handlePointClick = useCallback(
    (evt) => {
      if (!evt.points?.length) return;
      const { x, y } = evt.points[0];
      onPointClick?.(x, y);
    },
    [onPointClick]
  );

  return (
    <div style={aspectBoxStyle}>
      <div ref={surfaceRef} style={surfaceStyle(loading)}>
        <PanelTitle
          title={figureTitle({ index, group, scenario, model, year })}
          loading={loading}
          style={titleStyle}
        />
        <Plot
          data={plotData}
          layout={layout}
          useResizeHandler
          style={plotStyle}
          onRelayout={handleRelayout}
          onDoubleClick={resetZoom}
          onClick={handlePointClick}
          config={PLOT_CONFIG}
        />
        {error && <div style={centerMessageStyle('#ff6b6b')}>Failed to load data: {error}</div>}
        {!loading && !error && data.length === 0 && (
          <div style={centerMessageStyle('rgba(255,255,255,0.7)')}>
            No data available for this selection
          </div>
        )}
        <LoadingOverlay visible={loading} />
        <ZoomHint visible={zoomedArea != null && !loading} />
      </div>
    </div>
  );
};

export default MapDisplay;
