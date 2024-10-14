import React, { useState, useMemo, useRef } from 'react';
import GlobeDisplay from './components/GlobeDisplay';
import MapDisplay from './components/MapDisplay';
import LinePlot from './components/LinePlot';
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
  const [debouncedYear, setDebouncedYear] = useState(year); // Debounced year for the globe
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalText, setModalText] = useState('');

  const selectedPointRef = useRef({ x: null, y: null, year });
  const endYear = 2100; // End year for the line plot
  
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
  
  // Debounced update for globe
  const debouncedUpdateGlobe = useMemo(
    () =>
      _.debounce((newYear) => {
        setDebouncedYear(newYear); // Update the globe after the debounce delay
      }, 500), // Delay in milliseconds
    []
  );

  // Debounced update for line plot
  const debouncedUpdateLinePlot = useMemo(
    () =>
      _.debounce((newYear) => {
        if (selectedPointRef.current.x !== null && selectedPointRef.current.y !== null) {
          setSelectedPoint((prevPoint) => ({
            ...prevPoint,
            year: newYear,
          }));
        }
      }, 500), // Delay in milliseconds
    []
  );

  // Open modal with custom text
  const openModal = (category) => {
  let text = '';

  switch (category) {
    case 'Diversity Indices general':
      text = 'Different diversity indices based on the Habitat Suitability Index.';
      break;
    case 'Plankton Groups general':
      text = 'Marine taxonomic groupings important for global ecosystem services provided by our oceans. Total number of different species included were 859. Thereof 523 (~61%) zooplankton and 336 (~39%) phytoplankton species. Further species included were Copepods 272 (~32%), Diatoms 154 (~18%), Dinoflagelates 154 (~18%) and Coccolithophores 24 (~3%).';
      break;
    case 'RCP Scenarios general':
      text = 'The Intergovernmental Panel on Climate Change provide policymakers with scientific assessments on climate change such as the published scenarios of greenhouse gas concentration and emission pathways called representative concentration pathways (RCPs). The different climate scenarios are labelled after their respective radiative forcing in the year 2100 (e.g. RCP8.5 Wm-2). At present, global carbon emissions are tracking just above the highest representative concentration pathway (RCP 8.5) while the RCP 2.6 scenario represents the lowest concentration pathway with high mitigation strategies.';
      break;
    case 'Earth System Models general':
      text = 'Earth System Models (ESMs) are global climate models which represent biogeochemical processes that interact with the climate. The three different Earth System Models used are fully coupled models from the Coupled Model Inter- comparison Project (CMIP5) assessment.';
      break;
    case 'Diversity Indices':
      text = diversityMessages[selectedDiversity];
      break;
    case 'Plankton Groups':
      text = planktonMessages[selectedPlankton];
      break;
    case 'RCP Scenarios':
      text = rcpMessages[selectedRCP];
      break;
    case 'Earth System Models':
      text = modelMessages[selectedModel];
      break;
    default:
      text = 'No information available';
  }

  setModalText(text);
  setIsOpen(true);
};

  const closeModal = () => {
    setIsOpen(false);
  };

  // Update the map instantly, update the globe and line plot after debounce
  const handleSliderChange = (value) => {
    setYear(value); // Update the map immediately
    debouncedUpdateGlobe(value); // Trigger globe update after debounce
    debouncedUpdateLinePlot(value); // Trigger line plot update after debounce
  };

  const handlePointClick = (x, y) => {
    const point = { x, y };
    selectedPointRef.current = { ...point, year };
    setSelectedPoint({ ...point, year });
  };

  const [selectedPoint, setSelectedPoint] = useState({
    x: null,
    y: null,
    year,
  });

  return (
    <div className="App">
      {/* Header */}
      <header>
        <div className="header-content">
          <h1>Marine Plankton diversity bioindicator scenarios for policy <b>MAKER</b>s, <b>MAPMAKER</b></h1>
        </div>
      </header>

      {/* Four Columns with Dropdowns */}
      <div className="four-columns">
        {/* Column 1: Diversity Indices */}
        <div className="column">
          <button className="info-button" onClick={() => openModal('Diversity Indices general')}>Diversity Indices</button>
	  <select value={selectedDiversity} onChange={(e) => setSelectedDiversity(e.target.value)} className="dropdown">
            {diversityIndices.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {/* Column 2: Plankton Groups */}
        <div className="column">
          <button className="info-button" onClick={() => openModal('Plankton Groups general')}>Plankton Groups</button>
	  <select value={selectedPlankton} onChange={(e) => setSelectedPlankton(e.target.value)} className="dropdown">
            {filteredPlanktonGroups.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {/* Column 3: RCP Scenarios */}
        <div className="column">
          <button className="info-button" onClick={() => openModal('RCP Scenarios general')}>RCP Scenarios</button>
	  <select value={selectedRCP} onChange={(e) => setSelectedRCP(e.target.value)} className="dropdown">
          {filteredRcpScenarios.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
	  </select>
        </div>

        {/* Column 4: Earth System Models */}
        <div className="column">
          <button className="info-button" onClick={() => openModal('Earth System Models general')}>Earth System Models</button>
	  <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="dropdown">
          {filteredEarthModels.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
	  </select>
        </div>
      </div>

      {/* Five Buttons Below */}
      <div className="button-row">
      <button
        className="filter-button"
        style={{ backgroundColor: '#ADD8E6' }} // Light Blue
        onClick={() => openModal('Diversity Indices')}>
        {selectedDiversity}
      </button>
      <button
    className="filter-button"
    style={{ backgroundColor: '#00FF00' }} // Bright Green
    onClick={() => openModal('Plankton Groups')}>
    {selectedPlankton}
  </button>
  <button
    className="filter-button"
    style={{ backgroundColor: '#FFA500' }} // Orange
    onClick={() => openModal('RCP Scenarios')}>
    {selectedRCP}
  </button>
  <button
    className="filter-button"
    style={{ backgroundColor: '#FF6347' }} // Red
    onClick={() => openModal('Earth System Models')}>
    {selectedModel}
  </button>
  {/* <button
    className="filter-button"
    style={{ backgroundColor: '#A9A9A9' }} // Grey
    onClick={() => openModal("General Info")}>
    More Info
  </button> */}
      </div>

      {/* Modal Popup */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Information Modal">
        <h2>Explanation</h2>
        <p>{modalText}</p>
        <button onClick={closeModal}>Close</button>
      </Modal>
            {/* Year Slider */}
      <div className="slider-container">
        <Slider
          min={2012}
          max={2100}
          value={year}
          onChange={handleSliderChange}
          className="slider"
          handleStyle={[{ borderColor: '#1890ff', borderWidth: 2 }, { borderColor: '#1890ff', borderWidth: 2 }]}
        />
        <div className="slider-labels">
          <div className="slider-label" style={{ left: `${((year - 2012) / (2100 - 2012)) * 100}%` }}>
            {year}
          </div>
        </div>
      </div>
      {/* Flat Map */}
      <div className="map-display" >
        <MapDisplay
        year={year}
        index={selectedDiversity}
        group={selectedPlankton}
        scenario={selectedRCP}
        model={selectedModel}
        view="flat" onPointClick={handlePointClick} />
      </div>

     {/* Globe and Line Plot (side-by-side) */}
      <div className="visual-container">
        <div className="globe-container" style={{ flex: 1 }}>
        {/* Environmental Data Dropdown on top of the globe */}
        <div className="globe-dropdown-container">
          <label htmlFor="environmental-select">Environmental Data:</label>
          <select
            id="environmental-select"
            value={selectedEnvParam}
            onChange={(e) => setSelectedEnvParam(e.target.value)}
            className="dropdown"
          >
            {environmentalParameters.map((param) => (
              <option key={param} value={param}>
                {param}
              </option>
            ))}
          </select>
        </div>

        {/* Render the globe using debounced year */}
        <GlobeDisplay
          year={debouncedYear}
          index={selectedEnvParam} // Pass the environmental parameter to GlobeDisplay
          // index={selectedDiversity}
          // group={selectedPlankton}
          scenario={selectedRCP}
          model={selectedModel}
          view="left"
          onPointClick={handlePointClick}
        />
      </div>

      <div className="line-plot-container" style={{ flex: 2 }}>
        {selectedPoint.x !== null && selectedPoint.y !== null && (
          <LinePlot
            selectedPoint={selectedPoint}
            startYear={selectedPoint.year}
            endYear={endYear}
            index={selectedDiversity}
            group={selectedPlankton}
            scenario={selectedRCP}
            model={selectedModel}
            envParam={selectedEnvParam}
          />
        )}
      </div>
    </div>

	<Footer />

    </div>
  );
};

export default App;
