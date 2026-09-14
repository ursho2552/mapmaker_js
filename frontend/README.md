# MAPMAKER frontend

React single-page app that renders the plankton diversity and environmental
projections served by the Flask backend in [`../backend`](../backend). See the
[project README](../README.md) for the architecture and deployment instructions.

## Development

```sh
npm install
npm start            # dev server on http://localhost:3000
```

`package.json` sets `"proxy": "http://127.0.0.1:5000"`, so `/api/*` requests from
the dev server reach a backend running locally on port 5000 (`python app.py` in
`backend/`).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Development server with hot reload. |
| `npm test` | Jest test suite (`src/**/*.test.js`). |
| `npm run build` | Production bundle in `build/`, as served by nginx in the image. |

## Layout

```
src/
  App.js            Page layout, the two panels' state and the locks between them
  api/client.js     Calls to the Flask API; components never call fetch directly
  hooks/            useAsyncData, useDebouncedValue, useElementSize, useSyncedGlobes
  components/       DataPanel, ControlPanel, MapDisplay, GlobeDisplay, CombinedLinePlot,
                    modals and the tutorial
  components/common/  Shared building blocks: CollapsiblePanel, ColorLegend,
                    LoadingOverlay, LogoTile, PanelTitle, Spinner, ZoomHint
  styles/panels.js  MUI `sx` fragments: glass panels, selects, menus, dialogs, tutorial highlight
  styles/display.js Inline styles of the figures: surfaces, titles, legends, colour bars
  constants.js      Option lists, colour palettes, logos
  content.js        User-facing copy: descriptions, info texts, tutorial steps, references
  utils.js          Colour scales, legends and labels
```

Map, globe and line plot are loaded lazily, so Plotly and three.js land in their
own chunks. Plotly comes from its cartesian bundle (`components/Plot.js`), which
covers the heatmap and scatter traces used.

`three` is pinned to one exact version, with an `overrides` entry so that
`react-globe.gl` cannot pull in a second copy.
