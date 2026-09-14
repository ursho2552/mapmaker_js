# Marine Plankton Diversity Bioindicator Scenarios for Policy MAKERs

This web application provides interactive visualizations of marine plankton diversity using a Flask backend with a React-based frontend. The application includes a globe visualization, a flat map, a line plot for trends, and various filters for indices, plankton groups, climate scenarios, and models.

## Table of Contents

- [Features](#features)
- [Components](#components)
- [Project Structure](#project-structure)
- [Running with Docker](#running-with-docker)
- [Installation](#installation)
- [Firewall Configuration](#firewall-configuration)

## Features

- **Two linked data panels**: Compare scenarios, models and data sources side by side. Locks keep the year, scenario and model of the two panels in step, or let them differ.
- **Control panels**: Choose between plankton diversity and environmental conditions, then the scenario, Earth System Model, metric and plankton group. Info buttons explain every option.
- **Time slider**: View any year from 2012 to 2100.
- **Flat map visualisation**: 2D map drawn with `react-plotly.js`. Zooming is shared between the panels; double-click resets it.
- **Interactive globe display**: The same data on a 3D globe drawn with `react-globe.gl`. The two globes rotate together.
- **Time series**: Click a point on a map or globe to plot both panels' variables over time, or zoom into an area to plot its mean. The series can be downloaded as CSV.
- **Tutorial**: A guided tour of the interface, started from the header.
- **References**: Publications behind the data and models.

## Components

### `DataPanel`
Year slider with its lock, the map/globe switch, and the map or globe it drives.

### `ControlPanel`
Source, scenario, model, metric and group of one data panel. Both sit in the collapsible "Control Panels" card, with the scenario and model locks between them.

### `MapDisplay`
2D map drawn with `react-plotly.js` over an Earth texture, with a banded colour scale that diverges around zero for changes and scenario differences.

### `GlobeDisplay`
The same data on a 3D globe drawn with `react-globe.gl`, sampling every second grid cell, with a hand-drawn colour legend. Cameras of the two globes are kept in step by `useSyncedGlobes`.

### `CombinedLinePlot`
Time series of both panels' variables on two y-axes, at the selected point or averaged over the zoomed area (±1 SD).

### `InfoModal` / `ReferencesModal` / `Tutorial`
Explanatory text, references, and the step-by-step tutorial.

## Project Structure

```
backend/
  app.py                    Flask app: logging, CORS, response headers, CLI commands
  api.py                    HTTP handlers for /api/*, parameter validation, errors
  datasets.py               NetCDF reading: map slices and time series
  data_lookup_variables.py  Maps frontend choices to NetCDF files and variables
  config.py                 Environment-derived settings (DATA_DIR, DATA_URL, API_HOST, API_PORT)
  data_files.py             Checking for missing data files and syncing them from DATA_URL
  difference_env.py         Generates the environmental scenario-difference files
  gunicorn_config.py        Production server settings
  entrypoint.sh, Dockerfile Container image
frontend/
  Dockerfile, nginx.conf    Container image: static build served by nginx, /api proxied
  src/
    api/                    Calls to the backend
    hooks/                  Data fetching, debouncing, element size and globe camera sync
    components/             Components; common/ holds the shared building blocks
    styles/                 Style objects shared between components
    constants.js            Option lists, colour palettes, logos and other fixed data
    content.js              User-facing copy: descriptions, tutorial text, references
    utils.js                Pure helpers for colour scales, legends and labels
docker-compose.yml          Runs both containers
```

The NetCDF files are read from `backend/data/` unless `DATA_DIR` is set.

## Running with Docker

```sh
docker compose up --build
```

The app is then served on <http://localhost:8080>: nginx serves the React build
and proxies `/api` to the backend (gunicorn). `backend/data/` is mounted into the
backend container as its data directory, so put the NetCDF files there first.

On start the backend logs any data file the app can request that is missing.
Check this at any time with:

```sh
cd backend && flask --app app check-data
```

The environmental scenario differences (`Env_var_annual_mean_*_RCP85-RCP26.nc`
etc.) are derived from the per-scenario files with `python difference_env.py`.

### Syncing the data from a remote directory

Setting `DATA_URL` (commented out in `docker-compose.yml`) to a directory listing
of `.nc` files makes the backend download new or changed files into the data
directory on every start. A failed sync only logs an error; the files already
present are served. The same sync can be run by hand:

```sh
cd backend && flask --app app sync-data --url <directory listing URL>
```

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
4. **Clone this Application**
   Navigate to a chosen directory <directory>:\
   
   `git clone <your-repository-url>`
6. **Create a Python Virtual Environment and Install Dependencies**\
   `cd mapmaker_js/backend`\
   `python3 -m venv mapmaker_env`\
   `source mapmaker_env/bin/activate`\
   `pip install -r requirements.txt`

   `cd mapmaker_js/frontend`\
   `curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -`\
   `sudo dnf install -y nodejs`\
   `npm install`

7. **Test locally:**\
   run `python app.py` on the backend directory
   and `npm start` on the frontend directory

8. **Set Up Gunicorn:** Create a Gunicorn service file:\
   `pip install gunicorn`\
   `sudo vim /etc/systemd/system/mapmaker_backend.service`\
   Add the following:\
   ```
   [Unit]
   Description=Gunicorn instance to serve mapmaker-new
   After=network.target

   [Service]
   User=<username>
   Group=<group><group>
   WorkingDirectory=<directory>/mapmaker_js/backend
   Environment="PATH=<directory>/mapmaker_js/backend/mapmaker_env/bin"
   ExecStart=<directory>/mapmaker_js/backend/mapmaker_env/bin/gunicorn --workers 3 --bind unix:<directory>/mapmaker/mapmaker.sock  -m 007 --timeout 120 app:app

   [Install]
   WantedBy=multi-user.target
   ```

   Set ownership of the socket and directory:

   `sudo chown <username>:<group> <directory>/mapmaker_js/backend/mapmaker_backend.sock`\
   `sudo chmod 770 <directory>/mapmaker_js/backend/mapmaker_backend.sock`\
   `sudo chown <username>:<group> <directory>/mapmaker_js/backend`\
   `sudo chmod 755 <directory>/mapmaker_js/backend`

9. **Start and Enable Gunicorn:**\
   `sudo systemctl start mapmaker_backend`\
   `sudo systemctl enable mapmaker_backend`

10. **Build the React Application:**

   Before deploying, you need to build the frontend (React) application. From the frontend directory, run the following commands:

   `cd mapmaker_js/frontend`\
   `npm install`\
   `npm run build`

   `sudo mkdir -p <directory>/`\
   `mapmaker_js/frontend_build`\
   `sudo cp -r build/* <directory>/mapmaker_js/frontend_build/`

   Make sure the user and group match with those in mapmaker_backend.service

11. **Install and Configure Nginx:**\
    `sudo dnf install nginx`\
    `sudo vim /etc/nginx/sites-available/mapmaker``\
    Add the following:

   ```
      server {
      listen 80;
      server_name <servername>;

      location /mapmaker/static/ {
         alias <directory>/mapmaker_js/frontend_build/static/;
         expires 1y;
         access_log off;
         add_header Cache_Control "public";
      }

      #Serve the React app for all other routes (single-page application behaviour)
      location / {
         root <directory>/mapmaker_js/frontend_build;
         try_files $uri /index.html
      }

      # Proxy API requests to the backend (Flask)
      location /api {
         include proxy_params;
         proxy_pass http://unix:<directory>/mapmaker_js/backend/mapmaker_backend.sock;
         }
      }
   ```

11. **Enable the site:**\
   `sudo ln -s /etc/nginx/sites-available/mapmaker /etc/nginx/sites-enabled/`\
   `sudo nginx -t`\
   `sudo systemctl restart nginx`

   In case sites-available/ and sites-enabled/ do not exist, you can create them

   `sudo mkdir -p /etc/nginx/sites-available`

   Make sure proxy_params exists or create it
   'sudo vim /etc/nginx/proxy_params`\

   Write the following configuration:
   ```
   proxy_set_header Host $host;
   proxy_set_header X-Real-IP $remote_addr;
   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   proxy_set_header X-Forwarded-Proto $scheme;
   ```

12. **Update nginx.conf (if necessary):**

At the top set the user as in the mapmaker_backend.service\
`user <username>;`

In the http block you can add the following:
`include /etc/nginx/sites-enabled/*;

Near the end of the http block you can also add:\
`keep_alive_timeout 65;`\
`client_max_body_size 100M;`\
`proxy_buffer_size 128k;`\
`proxy_buffers 4 256k;`\
`proxy_busy_buffers_size 256k;`\
`proxy_max_temp_files_size 0;`

13. **Set Up HTTPS with Certbot:** Install Certbot and the Nginx plugin:\
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
