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

- **Filters and Modal Components**: Adjust data displayed by changing indices, plankton groups, climate scenarios, earth system models, and environmental parameters.
- **Time Slider**: View data for any year from 2012 to 2100.
- **Flat Map Visualization**: View geographical data on a flat 2D map.
- **Interactive Globe Display**: Visualize marine plankton diversity on a 3D globe.
- **Line Plot**: Display trends over time for a selected point or region.
<!-- - **Region Selection**: Toggle between point or region selection for the line plot. -->

## Components

### 1. **Filters and Modal Components**
- Displays explanatory text and information related to the selected index, plankton group, or model.
- Controlled by various buttons on the interface.

### 2. **Slider Component**
- Allows users to adjust the year of the displayed data dynamically.
- The globe, map, and line plot update accordingly.

### 3. **MapDisplay Component**
- Provides a 2D flat map view of the data using `react-plotly.js`.
- Data is color-coded, and the color scale can be customized for positive and negative values.
- Supports point or region selection for generating line plots.

### 4. **GlobeDisplay Component**
- Displays marine plankton data on a 3D globe.
- Data is fetched for the selected year and displayed with color-coded markers.
- Uses `react-globe.gl` and `d3-scale` for the color scale.
- Supports interaction like zooming, rotating, and clicking on points.

### 5. **LinePlot Component**
- Displays a time-series trend of selected points or regions.
- Can handle dual Y-axes to show trends of two variables.
- The user can choose an environmental parameter to compare with the main data.

## Installation

### Prerequisites

- A Linux-based server (e.g., Ubuntu) with `Python 3.9+`
- `Nginx` as the reverse proxy server
- `Gunicorn` as the WSGI server for running Flask
- `Certbot` for managing HTTPS certificates via Let's Encrypt
- Shorewall for firewall management

### Step-by-Step Installation

1. **SSH into the Server:**\
   `ssh username@servername`
2. **Update the System:**\
   `sudo dnf update`\
   `sudo dnf upgrade`
3. **Install Dependencies** Install Python 3, pip, and venv:\
   `sudo dnf install python3-pip python3-virtualenv nginx git`
4. **Clone this Application** Navigate to the /var/www/ directory:\
   `cd /var/www/`\
   `sudo mkdir mapmaker`\
   `cd mapmaker`\
   `git clone <your-repository-url>`
5. **Create a Python Virtual Environment and Install Dependencies**\
   `cd backend`\
   `python3 -m venv mapmaker_env`\
   `source mapmaker_env/bin/activate`\
   `pip install -r requirements.txt`\

   `cd frontend`\
   `curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -`\
   `sudo dnf install -y nodejs`\
   `npm install`

6. **Test locally:**\
   run `python app.py` on the backend directory
   and `npm start` on the frontend directory
7. **Build the React Application:**

   Before deploying, you need to build the frontend (React) application. From the frontend directory, run the following commands:

   `cd frontend`\
   `npm install`\
   `npm run build`

8. **Set Up Gunicorn:** Create a Gunicorn service file:\
   `sudo nano /etc/systemd/system/mapmaker.service`\
   Add the following:\
   ```
   [Unit]
   Description=Gunicorn instance to serve mapmaker-new
   After=network.target

   [Service]
   User=<username>
   Group=www-data
   WorkingDirectory=/var/www/mapmaker
   Environment="PATH=/var/www/mapmaker/backend/mapmaker_env/bin"
   ExecStart=/var/www/mapmaker/backend/mapmaker_env/bin/gunicorn --workers 3 --bind unix:/var/www/mapmaker/mapmaker.sock wsgi:app

   [Install]
   WantedBy=multi-user.target
   ```
9. **Start and Enable Gunicorn:**\
   `sudo systemctl start mapmaker`\
   `sudo systemctl enable mapmaker`
10. **Install and Configure Nginx:**\
    `sudo apt install nginx`\
    `sudo nano /etc/nginx/sites-available/mapmaker``\
    Add the following:

   ```
      server {
      listen 80;
      server_name mapmaker;

      location / {
         include proxy_params;
         proxy_pass http://unix:/var/www/mapmaker/mapmaker.sock;
         }
      }
   ```

11. **Enable the site:**\
   `sudo ln -s /etc/nginx/sites-available/mapmaker /etc/nginx/sites-enabled`\
   `sudo nginx -t`\
   `sudo systemctl restart nginx`

12. **Set Up HTTPS with Certbot:** Install Certbot and the Nginx plugin:\
`sudo apt install certbot python3-certbot-nginx`\
`sudo certbot --nginx -d mapmaker-new`

## Firewall Configuration

### Using Shorewall

To configure the firewall using Shorewall, follow these steps to manage access to the web server.

#### Edit Shorewall Rules
You need to edit the `/etc/shorewall/rules` file to modify access settings:

`sudo nano /etc/shorewall/rules`

#### Allow Access from a Specific IP
To allow access from a specific IP address (replace xxx.xxx.xxx.xxx with the actual IP), add the following rule:\
`ACCEPT net:xxx.xxx.xxx.xxx fw tcp 80,443`

#### Reload the Firewall

`sudo systemctl reload shorewall`

#### Full Webserver Access

`ACCEPT net fw tcp 80,443`\
`sudo systemctl reload shorewall`