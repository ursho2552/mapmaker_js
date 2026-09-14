// Plotly's cartesian bundle covers the traces we use (scatter, heatmap) and is far
// smaller than the full build that `import Plot from 'react-plotly.js'` pulls in.
import createPlotlyComponent from 'react-plotly.js/factory';
import Plotly from 'plotly.js/dist/plotly-cartesian.min';

const Plot = createPlotlyComponent(Plotly);

export default Plot;
