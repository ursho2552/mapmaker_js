import { fetchGrid, fetchTimeseries } from './client';

const respond = (status, body) =>
  Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(body) });

const requestedUrl = () => new URL(global.fetch.mock.calls[0][0], 'http://localhost');

beforeEach(() => {
  global.fetch = jest.fn(() => respond(200, { lats: [] }));
});

describe('fetchGrid', () => {
  test('plankton data comes from map-data, with encoded parameters', async () => {
    await fetchGrid({
      sourceType: 'plankton', year: 2050, index: 'Species Richness',
      group: 'Total Plankton', scenario: 'RCP 2.6 (Paris Agreement)', model: 'Model Mean',
    });
    const url = requestedUrl();
    expect(url.pathname).toBe('/api/map-data');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      year: '2050', index: 'Species Richness', group: 'Total Plankton',
      scenario: 'RCP 2.6 (Paris Agreement)', model: 'Model Mean',
    });
  });

  test('environmental data comes from globe-data, without a group', async () => {
    await fetchGrid({
      sourceType: 'environmental', year: 2030, index: 'Temperature',
      group: 'Diatoms', scenario: 'RCP 4.5', model: 'CNRM-CM5',
    });
    const url = requestedUrl();
    expect(url.pathname).toBe('/api/globe-data');
    expect(url.searchParams.get('source')).toBe('env');
    expect(url.searchParams.has('group')).toBe(false);
  });

  test('passes the abort signal to fetch', async () => {
    const { signal } = new AbortController();
    await fetchGrid({ sourceType: 'plankton', year: 2030 }, signal);
    expect(global.fetch.mock.calls[0][1]).toEqual({ signal });
  });

  test('surfaces the backend error message', async () => {
    global.fetch = jest.fn(() => respond(400, { error: 'Unknown or missing option: Krill' }));
    await expect(fetchGrid({ sourceType: 'plankton', year: 2030 }))
      .rejects.toThrow('Unknown or missing option: Krill');
  });

  test('falls back to the status when the error body is not JSON', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, status: 502, json: () => Promise.reject(new SyntaxError()) }));
    await expect(fetchGrid({ sourceType: 'plankton', year: 2030 }))
      .rejects.toThrow('Backend error 502');
  });
});

describe('fetchTimeseries', () => {
  const settings = {
    index: 'Change in HSI', group: 'Diatoms', scenario: 'RCP 8.5 - RCP 2.6',
    model: 'GFDL-ESM2M', envParam: 'Oxygen',
  };

  test('requests a point', async () => {
    await fetchTimeseries({ settings, point: { x: 10.5, y: -20.5 }, startYear: 2012, endYear: 2100 });
    const params = Object.fromEntries(requestedUrl().searchParams);
    expect(params).toMatchObject({ x: '10.5', y: '-20.5', startYear: '2012', endYear: '2100', envParam: 'Oxygen' });
    expect(params).not.toHaveProperty('xMin');
  });

  test('requests an area instead of the point when one is given', async () => {
    await fetchTimeseries({
      settings, point: { x: 1, y: 2 }, area: { x: [-40, -20], y: [30, 50] },
      startYear: 2012, endYear: 2100,
    });
    const params = Object.fromEntries(requestedUrl().searchParams);
    expect(params).toMatchObject({ xMin: '-40', xMax: '-20', yMin: '30', yMax: '50' });
    expect(params).not.toHaveProperty('x');
  });
});
