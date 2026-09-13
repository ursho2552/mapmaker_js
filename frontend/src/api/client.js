// Thin wrapper around the Flask API. Components never call fetch directly.

const request = async (path, params, signal) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${path}?${query}`, { signal });

  // The backend answers errors with JSON `{ error }`; fall back to the status.
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || `Backend error ${res.status}`);
  return data;
};

/**
 * One year of a plankton index or environmental parameter on the lat/lon grid:
 * `{ lats, lons, variable, colorscale, minValue, maxValue }`.
 */
export const fetchGrid = ({ sourceType, year, index, group, scenario, model }, signal) =>
  sourceType === 'environmental'
    ? request('/api/globe-data', { source: 'env', year, index, scenario, model }, signal)
    : request('/api/map-data', { year, index, group: group ?? '', scenario, model }, signal);

/**
 * Time series of one panel's plankton index and environmental parameter, at a
 * point `{ x, y }` or averaged over an area `{ x: [min, max], y: [min, max] }`.
 */
export const fetchTimeseries = ({ settings, point, area, startYear, endYear }, signal) => {
  const location = area
    ? { xMin: area.x[0], xMax: area.x[1], yMin: area.y[0], yMax: area.y[1] }
    : { x: point.x, y: point.y };

  return request('/api/line-data', {
    ...location,
    startYear,
    endYear,
    index: settings.index,
    group: settings.group || '',
    scenario: settings.scenario,
    model: settings.model,
    envParam: settings.envParam,
  }, signal);
};
