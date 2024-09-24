# Marine Plankton Diversity Bioindicator Scenarios for Policy MAKERs

This web application provides interactive visualizations of marine plankton diversity using a Flask backend with a React-based frontend. The application includes a globe visualization, a flat map, a line plot for trends, and various filters for indices, plankton groups, climate scenarios, and models.

## Table of Contents

- [Features](#features)
- [Components](#components)
- [Installation](#installation)
- [Server Configuration](#server-configuration)
- [Deployment](#deployment)
- [Firewall Configuration](#firewall-configuration)
- [Usage](#usage)
- [License](#license)

## Features

- **Interactive Globe Display**: Visualize marine plankton diversity on a 3D globe.
- **Flat Map Visualization**: View geographical data on a flat 2D map.
- **Line Plot**: Display trends over time for a selected point or region.
- **Filters**: Adjust data displayed by changing indices, plankton groups, climate scenarios, earth system models, and environmental parameters.
- **Time Slider**: View data for any year from 2012 to 2100.
- **Region Selection**: Toggle between point or region selection for the line plot.

## Components

### 1. **GlobeDisplay Component**
- Displays marine plankton data on a 3D globe.
- Data is fetched for the selected year and displayed with color-coded markers.
- Uses `react-globe.gl` and `d3-scale` for the color scale.
- Supports interaction like zooming, rotating, and clicking on points.

### 2. **MapDisplay Component**
- Provides a 2D flat map view of the data using `react-plotly.js`.
- Data is color-coded, and the color scale can be customized for positive and negative values.
- Supports point or region selection for generating line plots.

### 3. **LinePlot Component**
- Displays a time-series trend of selected points or regions.
- Can handle dual Y-axes to show trends of two variables.
- The user can choose an environmental parameter to compare with the main data.

### 4. **Slider Component**
- Allows users to adjust the year of the displayed data dynamically.
- The globe, map, and line plot update accordingly.

### 5. **Modal Component**
- Displays explanatory text and information related to the selected index, plankton group, or model.
- Controlled by various buttons on the interface.

## Installation

### Prerequisites

- A Linux-based server (e.g., Ubuntu) with `Python 3.9+`
- `Nginx` as the reverse proxy server
- `Gunicorn` as the WSGI server for running Flask
- `Certbot` for managing HTTPS certificates via Let's Encrypt
- Shorewall for firewall management

### Step-by-Step Installation

1. **SSH into the Server:**
   ssh username@servername
2. **Update the System:**
   sudo apt update
   sudo apt upgrade
3. **Install Dependencies** Install Python 3, pip, and venv:
   sudo apt install python3-pip python3-venv nginx git
4. **Clone this Application** Navigate to the /var/www/ directory:
   cd /var/www/
   sudo mkdir mapmaker
   cd mapmaker
   git clone <your-repository-url> 
6. **Create a Python Virtual Environment and Install Dependencies**
   cd backend
   python3 -m venv mapmaker_env
   source mapmaker_env/bin/activate
   pip install -r requirements.txt
7. **Test locally:**
   run python app.py on the backend directory
   run npm start on the frontend directory
   


   
