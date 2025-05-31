import React, { useState, useMemo, useEffect } from 'react';
import GlobeDisplay from './components/GlobeDisplay';
import MapDisplay from './components/MapDisplay';
import CombinedLinePlot from './components/CombinedLinePlot';
import Footer from './components/Footer';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './App.css';
import Modal from 'react-modal';
import _ from 'lodash';

// Initialize Modal for accessibility
Modal.setAppElement('#root');

// Options for each dropdown
const diversityIndices = ['Biomes', 'Species Richness', 'Hotspots of Change in Diversity',
 'Habitat Suitability Index (HSI)', 'Change in HSI', 'Species Turnover'];
const planktonGroups = ['Total Plankton', 'Zooplankton', 'Phytoplankton', 'Copepods', 'Diatoms',
  'Dinoflagellates', 'Coccolithophores'];
const rcpScenarios = ['RCP 2.6 (Paris Agreement)', 'RCP 4.5', 'RCP 8.5 (Business as Usual)',
  'RCP 8.5 - RCP2.6', 'RCP 8.5 - RCP 4.5', 'RCP 4.5 - RCP 2.6'];
const earthModels = ['Model Mean', 'CNRM-CM5', 'GFDL-ESM2M', 'IPSL-CMSA-LR'];
const environmentalParameters = ['Temperature', 'Oxygen', 'Change in Temperature', 'Chlorophyll-a Concentration'];

// Custom modal text for diversity indices
const diversityMessages = {
  'Biomes': 'Biomes refer to distinct biological communities that have formed in response to a shared physical climate.',
  'Species Richness': 'Species richness is the number of different species represented in an ecological community, landscape or region.',
  'Hotspots of Change in Diversity': 'Hotspots of change in diversity indicate areas where significant changes in species diversity are occurring.',
  'Habitat Suitability Index (HSI)': 'HSI is an index that represents the suitability of a given habitat for a species or group of species.',
  'Change in HSI': 'Change in Habitat Suitability Index tracks how suitable a habitat is for species over time.',
  'Species Turnover': 'Species turnover refers to the rate at which one species replaces another in a community over time.'
};

// Custom modal text for plankton groups
const planktonMessages = {
  'Total Plankton': 'Total Plankton includes all microscopic organisms, including both phytoplankton and zooplankton.',
  'Zooplankton': 'Zooplankton are small drifting animals in the water, including species such as jellyfish and crustaceans.',
  'Phytoplankton': 'Phytoplankton are microscopic marine algae that form the foundation of the ocean food web.',
  'Copepods': 'Copepods are a type of small crustacean found in nearly every freshwater and saltwater habitat.',
  'Diatoms': 'Diatoms are a group of microalgae that are known for their unique silica-based cell walls.',
  'Dinoflagellates': 'Dinoflagellates are a type of plankton responsible for phenomena like red tides and bioluminescence.',
  'Coccolithophores': 'Coccolithophores are single-celled marine algae surrounded by a microscopic plating made of calcium carbonate.'
};

// Custom modal text for RCP scenarios
const rcpMessages = {
  'RCP 2.6 (Paris Agreement)': 'RCP 2.6 is a scenario that assumes global annual greenhouse gas emissions peak between 2010–2020 and decline substantially thereafter.',
  'RCP 4.5': 'RCP 4.5 is an intermediate scenario where emissions peak around 2040, then decline.',
  'RCP 8.5 (Business as Usual)': 'RCP 8.5 is a high greenhouse gas emission scenario often considered the "business as usual" pathway.',
  'RCP 8.5 - RCP2.6': 'Difference between RCP 8.5 and RCP 2.6; highlights the contrast between high-emission and stringent mitigation pathways.',
  'RCP 8.5 - RCP 4.5': 'Difference between RCP 8.5 and RCP 4.5; shows the impact of extreme versus intermediate emission trajectories.',
  'RCP 4.5 - RCP 2.6': 'Difference between RCP 4.5 and RCP 2.6; illustrates the benefits of intermediate versus stringent mitigation scenarios.',
  'RCP 8.5 - RCP2.6': 'This difference shows the projected climate outcomes between the high-emission RCP 8.5 and the low-emission RCP 2.6 scenario.',
  'RCP 8.5 - RCP 4.5': 'This scenario shows the differences between the high-emission RCP 8.5 and moderate-emission RCP 4.5 pathways.',
  'RCP 4.5 - RCP 2.6': 'This scenario compares the moderate-emission RCP 4.5 and low-emission RCP 2.6 pathways.'
};

// Custom modal text for earth system models
const modelMessages = {
  'Model Mean': 'The Model Mean represents the average outcome across multiple climate models, providing a consensus projection.',
  'CNRM-CM5': 'CNRM-CM5 is a global climate model developed by Météo-France in collaboration with other research institutions.',
  'GFDL-ESM2M': 'GFDL-ESM2M is a coupled climate model developed by NOAA’s Geophysical Fluid Dynamics Laboratory.',
  'IPSL-CMSA-LR': 'IPSL-CMSA-LR is a climate model developed by the Institut Pierre-Simon Laplace, used for climate projections.'
};

const App = () => {
  const [selectedDiversity, setSelectedDiversity] = useState(diversityIndices[1]);
  const [selectedPlankton, setSelectedPlankton] = useState(planktonGroups[0]);
  const [selectedRCP, setSelectedRCP] = useState(rcpScenarios[0]);
  const [selectedModel, setSelectedModel] = useState(earthModels[0]);
  const [selectedEnvParam, setSelectedEnvParam] = useState(environmentalParameters[0]);
  const [year, setYear] = useState(2012); // Track only one year
  // per-panel years
  const [panel1Year, setPanel1Year] = useState(2012);
  const [panel1DebouncedYear, setPanel1DebouncedYear] = useState(2012);
  const [panel2Year, setPanel2Year] = useState(2012);
  const [panel2DebouncedYear, setPanel2DebouncedYear] = useState(2012);
  // Panel 1 and Panel 2 settings: sourceType = 'plankton' or 'environmental'; view = 'map' or 'globe'
  const [panel1Source, setPanel1Source] = useState('plankton');
  const [panel1View, setPanel1View] = useState('map');
  const [panel1EnvParam, setPanel1EnvParam] = useState(environmentalParameters[0]);
  const [panel2Source, setPanel2Source] = useState('environmental');
  const [panel2View, setPanel2View] = useState('globe');
  const [panel2EnvParam, setPanel2EnvParam] = useState(environmentalParameters[0]);
  // Panel-specific plankton settings
  const [panel1Diversity, setPanel1Diversity] = useState(selectedDiversity);
  const [panel1Group, setPanel1Group] = useState(selectedPlankton);
  const [panel1RCP, setPanel1RCP] = useState(selectedRCP);
  const [panel1Model, setPanel1Model] = useState(selectedModel);
  const [panel2Diversity, setPanel2Diversity] = useState(selectedDiversity);
  const [panel2Group, setPanel2Group] = useState(selectedPlankton);
  const [panel2RCP, setPanel2RCP] = useState(selectedRCP);
  const [panel2Model, setPanel2Model] = useState(selectedModel);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalText, setModalText] = useState('');

  // Single selected point for combined line chart
  const [selectedPoint, setSelectedPoint] = useState({ x: null, y: null });
  const endYear = 2100;
  // Unified click handler
  const handlePointClick = (x, y) => setSelectedPoint({ x, y });
  
 // Filter RCP scenarios based on selected diversity index
  const filteredRcpScenarios = selectedDiversity === 'Biomes'
    ? rcpScenarios.slice(0, 3) // First three options if "Biomes" is selected
    : rcpScenarios; // All options otherwise

  const filteredEarthModels = selectedDiversity === 'Biomes'
    ? earthModels.slice(0, 1) // Only the first option if "Biomes" is selected
    : earthModels; // All options otherwise

  const filteredPlanktonGroups = selectedDiversity === 'Biomes'
    ? planktonGroups.slice(0, 1) // Only the first option if "Biomes" is selected
    : planktonGroups; // All options otherwise
  
  // Filter options for panel-specific plankton settings
  const filteredRcpScenariosPanel1 = panel1Diversity === 'Biomes'
    ? rcpScenarios.slice(0, 3)
    : rcpScenarios;
  const filteredModelsPanel1 = panel1Diversity === 'Biomes'
    ? earthModels.slice(0, 1)
    : earthModels;
  const filteredGroupsPanel1 = panel1Diversity === 'Biomes'
    ? planktonGroups.slice(0, 1)
    : planktonGroups;
  const filteredRcpScenariosPanel2 = panel2Diversity === 'Biomes'
    ? rcpScenarios.slice(0, 3)
    : rcpScenarios;
  const filteredModelsPanel2 = panel2Diversity === 'Biomes'
    ? earthModels.slice(0, 1)
    : earthModels;
  const filteredGroupsPanel2 = panel2Diversity === 'Biomes'
    ? planktonGroups.slice(0, 1)
    : planktonGroups;
  // Debounced update for panel1
  const debouncedUpdatePanel1 = useMemo(
    () => _.debounce(newYear => setPanel1DebouncedYear(newYear), 500),
    []
  );
  // Debounced update for panel2
  const debouncedUpdatePanel2 = useMemo(
    () => _.debounce(newYear => setPanel2DebouncedYear(newYear), 500),
    []
  );


  // Open modal with custom text
  const openModal = (category) => {
    let text = '';
    // Parameter-level help (ends with ' general')
    if (category.endsWith(' general')) {
      const key = category.replace(/ general$/, '');
      switch (key) {
        case 'Diversity Indices':
          text = 'Different diversity indices based on the Habitat Suitability Index.';
          break;
        case 'Plankton Groups':
          text = 'Marine taxonomic groupings important for global ecosystem services provided by our oceans.';
          break;
        case 'RCP Scenarios':
          text = 'Representative Concentration Pathways describe greenhouse gas trajectories and radiative forcing scenarios.';
          break;
        case 'Earth System Models':
          text = 'Earth System Models are coupled climate-biogeochemical models used for projecting environmental changes.';
          break;
        default:
          text = 'No information available';
      }
    } else {
      // Value-level help: look up in corresponding message maps
      if (diversityMessages[category]) text = diversityMessages[category];
      else if (planktonMessages[category]) text = planktonMessages[category];
      else if (rcpMessages[category]) text = rcpMessages[category];
      else if (modelMessages[category]) text = modelMessages[category];
      else text = 'No information available';
    }
    setModalText(text);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };



  return (
    <div className="App">
      {/* Header */}
      <header>
        <div className="header-content">
          <h1>Marine Plankton diversity bioindicator scenarios for policy <b>MAKER</b>s, <b>MAPMAKER</b></h1>
        </div>
      </header>

      {/* Top summary panels removed */}

      {/* Top filter buttons removed */}

      {/* Modal Popup */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Information Modal">
        <h2>Explanation</h2>
        <p>{modalText}</p>
        <button onClick={closeModal}>Close</button>
      </Modal>

      {/* Dual Data Panels */}
      <div className="dual-display" style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
        {/* Panel 1 */}
        <div className="display-panel" style={{ flex: 1 }}>
          <div className="panel-controls" style={{ marginBottom: '8px', color: 'white' }}>
            {/* Data type selection */}
            <select id="source1" value={panel1Source} onChange={e => setPanel1Source(e.target.value)} className="dropdown">
              <option value="plankton">Plankton</option>
              <option value="environmental">Environmental</option>
            </select>
            {/* View selection via radio buttons */}
            <div className="radio-group">
              <label><input type="radio" name="view1" value="map" checked={panel1View==='map'} onChange={e=>setPanel1View(e.target.value)} />Map</label>
              <label><input type="radio" name="view1" value="globe" checked={panel1View==='globe'} onChange={e=>setPanel1View(e.target.value)} />Globe</label>
            </div>
            {panel1Source === 'plankton' && (
              <>
                <div className="input-with-icon">
                  <label htmlFor="diversity1">Index:</label>
                  <button className="icon-button" onClick={() => openModal('Diversity Indices general')}>?</button>
                  <select id="diversity1" value={panel1Diversity} onChange={e => setPanel1Diversity(e.target.value)} className="dropdown">
                    {diversityIndices.map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <button className="icon-button" onClick={() => openModal(panel1Diversity)}>?</button>
                </div>
                <div className="input-with-icon">
                  <label htmlFor="group1">Group:</label>
                  <button className="icon-button" onClick={() => openModal('Plankton Groups general')}>?</button>
                  <select id="group1" value={panel1Group} onChange={e => setPanel1Group(e.target.value)} className="dropdown">
                    {filteredGroupsPanel1.map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <button className="icon-button" onClick={() => openModal(panel1Group)}>?</button>
                </div>
                <div className="input-with-icon">
                  <label htmlFor="rcp1">Scenario:</label>
                  <button className="icon-button" onClick={() => openModal('RCP Scenarios general')}>?</button>
                  <select id="rcp1" value={panel1RCP} onChange={e => setPanel1RCP(e.target.value)} className="dropdown">
                    {filteredRcpScenariosPanel1.map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <button className="icon-button" onClick={() => openModal(panel1RCP)}>?</button>
                </div>
                <div className="input-with-icon">
                  <label htmlFor="model1">Model:</label>
                  <button className="icon-button" onClick={() => openModal('Earth System Models general')}>?</button>
                  <select id="model1" value={panel1Model} onChange={e => setPanel1Model(e.target.value)} className="dropdown">
                    {filteredModelsPanel1.map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <button className="icon-button" onClick={() => openModal(panel1Model)}>?</button>
                </div>
              </>
            )}
            {panel1Source === 'environmental' && (
              <>
                <label htmlFor="env1" style={{ margin: '0 4px' }}>Metric:</label>
                <select id="env1" value={panel1EnvParam} onChange={e => setPanel1EnvParam(e.target.value)} className="dropdown">
                  {environmentalParameters.map(param => (
                    <option key={param} value={param}>{param}</option>
                  ))}
                </select>
              </>
            )}
        </div>
        {/* Year Slider for Panel 1 */}
        <div className="slider-container" style={{ marginBottom: '12px' }}>
          <Slider
            min={2012}
            max={2100}
            value={panel1Year}
            onChange={value => { setPanel1Year(value); debouncedUpdatePanel1(value); }}
            className="slider"
            handleStyle={[{ borderColor: '#1890ff', borderWidth: 2 }, { borderColor: '#1890ff', borderWidth: 2 }]}
          />
          <div className="slider-labels">
            <div className="slider-label" style={{ left: `${((panel1Year - 2012) / (2100 - 2012)) * 100}%` }}>
              {panel1Year}
            </div>
          </div>
        </div>
          {/* Render Panel 1 content based on selection */}
          {panel1Source === 'plankton' && panel1View === 'map' && (
            <MapDisplay
              year={panel1Year}
              index={panel1Diversity}
              group={panel1Group}
              scenario={panel1RCP}
              model={panel1Model}
              sourceType="plankton"
              onPointClick={handlePointClick}
            />
          )}
          {panel1Source === 'plankton' && panel1View === 'globe' && (
            <GlobeDisplay
              year={panel1DebouncedYear}
              index={panel1Diversity}
              group={panel1Group}
              scenario={panel1RCP}
              model={panel1Model}
              sourceType="plankton"
            onPointClick={handlePointClick}
            />
          )}
          {panel1Source === 'environmental' && panel1View === 'map' && (
              <MapDisplay
              year={panel1Year}
              index={panel1EnvParam}
              scenario={panel1RCP}
              model={panel1Model}
              sourceType="environmental"
              onPointClick={handlePointClick}
            />
          )}
          {panel1Source === 'environmental' && panel1View === 'globe' && (
              <GlobeDisplay
              year={panel1DebouncedYear}
              index={panel1EnvParam}
              scenario={panel1RCP}
              model={panel1Model}
              sourceType="environmental"
            onPointClick={handlePointClick}
            />
          )}
        </div>
        {/* Panel 2 */}
        <div className="display-panel" style={{ flex: 1 }}>
          <div className="panel-controls" style={{ marginBottom: '8px', color: 'white' }}>
            {/* Data type selection */}
            <select id="source2" value={panel2Source} onChange={e => setPanel2Source(e.target.value)} className="dropdown">
              <option value="plankton">Plankton</option>
              <option value="environmental">Environmental</option>
            </select>
            {/* View selection via radio buttons */}
            <div className="radio-group">
              <label><input type="radio" name="view2" value="map" checked={panel2View==='map'} onChange={e=>setPanel2View(e.target.value)} />Map</label>
              <label><input type="radio" name="view2" value="globe" checked={panel2View==='globe'} onChange={e=>setPanel2View(e.target.value)} />Globe</label>
            </div>
            {panel2Source === 'plankton' && (
              <>
                <div className="input-with-icon">
                  <label htmlFor="diversity2">Index:</label>
                  <button className="icon-button" onClick={() => openModal('Diversity Indices general')}>?</button>
                  <select id="diversity2" value={panel2Diversity} onChange={e => setPanel2Diversity(e.target.value)} className="dropdown">
                    {diversityIndices.map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <button className="icon-button" onClick={() => openModal(panel2Diversity)}>?</button>
                </div>
                <div className="input-with-icon">
                  <label htmlFor="group2">Group:</label>
                  <button className="icon-button" onClick={() => openModal('Plankton Groups general')}>?</button>
                  <select id="group2" value={panel2Group} onChange={e => setPanel2Group(e.target.value)} className="dropdown">
                    {filteredGroupsPanel2.map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <button className="icon-button" onClick={() => openModal(panel2Group)}>?</button>
                </div>
                <div className="input-with-icon">
                  <label htmlFor="rcp2">Scenario:</label>
                  <button className="icon-button" onClick={() => openModal('RCP Scenarios general')}>?</button>
                  <select id="rcp2" value={panel2RCP} onChange={e => setPanel2RCP(e.target.value)} className="dropdown">
                    {filteredRcpScenariosPanel2.map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <button className="icon-button" onClick={() => openModal(panel2RCP)}>?</button>
                </div>
                <div className="input-with-icon">
                  <label htmlFor="model2">Model:</label>
                  <button className="icon-button" onClick={() => openModal('Earth System Models general')}>?</button>
                  <select id="model2" value={panel2Model} onChange={e => setPanel2Model(e.target.value)} className="dropdown">
                    {filteredModelsPanel2.map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <button className="icon-button" onClick={() => openModal(panel2Model)}>?</button>
                </div>
              </>
            )}
            {panel2Source === 'environmental' && (
              <>
                <label htmlFor="env2" style={{ margin: '0 4px' }}>Metric:</label>
                <select id="env2" value={panel2EnvParam} onChange={e => setPanel2EnvParam(e.target.value)} className="dropdown">
                  {environmentalParameters.map(param => (
                    <option key={param} value={param}>{param}</option>
                  ))}
                </select>
              </>
            )}
        </div>
        {/* Year Slider for Panel 2 */}
        <div className="slider-container" style={{ marginBottom: '12px' }}>
          <Slider
            min={2012}
            max={2100}
            value={panel2Year}
            onChange={value => { setPanel2Year(value); debouncedUpdatePanel2(value); }}
            className="slider"
            handleStyle={[{ borderColor: '#1890ff', borderWidth: 2 }, { borderColor: '#1890ff', borderWidth: 2 }]}
          />
          <div className="slider-labels">
            <div className="slider-label" style={{ left: `${((panel2Year - 2012) / (2100 - 2012)) * 100}%` }}>
              {panel2Year}
            </div>
          </div>
        </div>
          {/* Render Panel 2 content based on selection */}
          {panel2Source === 'plankton' && panel2View === 'map' && (
            <MapDisplay
              year={panel2Year}
              index={panel2Diversity}
              group={panel2Group}
              scenario={panel2RCP}
              model={panel2Model}
              sourceType="plankton"
              onPointClick={handlePointClick}
            />
          )}
          {panel2Source === 'plankton' && panel2View === 'globe' && (
            <GlobeDisplay
              year={panel2DebouncedYear}
              index={panel2Diversity}
              group={panel2Group}
              scenario={panel2RCP}
              model={panel2Model}
              sourceType="plankton"
            onPointClick={handlePointClick}
            />
          )}
          {panel2Source === 'environmental' && panel2View === 'map' && (
            <MapDisplay
              year={panel2Year}
              index={panel2EnvParam}
              scenario={panel2RCP}
              model={panel2Model}
              sourceType="environmental"
              onPointClick={handlePointClick}
            />
          )}
          {panel2Source === 'environmental' && panel2View === 'globe' && (
            <GlobeDisplay
              year={panel2DebouncedYear}
              index={panel2EnvParam}
              scenario={panel2RCP}
              model={panel2Model}
              sourceType="environmental"
            onPointClick={handlePointClick}
            />
          )}
        </div>
      </div> {/* dual-display panels */}

      {/* Combined line chart (full width) for both panel metrics at clicked point */}
      <div className="combined-lineplot" style={{ width: '100%', marginTop: '24px' }}>
        <CombinedLinePlot
          point={selectedPoint}
          leftSettings={{
            source: panel1Source,
            index: panel1Diversity,
            group: panel1Group,
            envParam: panel1EnvParam,
            scenario: panel1RCP,
            model: panel1Model,
          }}
          rightSettings={{
            source: panel2Source,
            index: panel2Diversity,
            group: panel2Group,
            envParam: panel2EnvParam,
            scenario: panel2RCP,
            model: panel2Model,
          }}
          startYear={2012}
          endYear={2100}
        />
      </div>

      <Footer />

    </div>
  );
};

export default App;
