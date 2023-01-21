# PMI

Welcome to the BOATMAN repository!

This project is a boat monitoring system that uses satellite imagery from the Copernicus Program to track and display the location of boats in a geographic information system (GIS).

The system is composed of a frontend, the GIS, and a backend, the server. The frontend is built using JavaScript, specifically the Leaflet library, which allows us to create interactive maps that can display and update the position of boats in real time. The backend is built using Python and the library FastAPI, which allows it to handle the interactions with the frontend. The server is also where we download and process the Sentinel-1 data from the Copernicus Program.

## Server Side

### Installation

This project uses [SNAP](https://step.esa.int/main/download/snap-download/), however its installation will be done automatically by conda.
To access `SNAP` through python, we use `snapista`, a conda package.
Unfortunately, very specific version of python packages are needed to install it.

To ease the installation, we provide an `yml` file for conda to create a clean environment.

You can install it with:

```bash
conda env create -f environment.yml
```

The new environment will be called `snap`, documentation to change this can be found [here](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html#creating-an-environment-from-an-environment-yml-file).

Don't forget to activate the environment with:

```bash
conda activate snap
```

### Authentication

This project uses data from the Copernicus Open Access Hub.
Like most Data Hubs, it requires authentication.
In order to be able to download data from the Copernicus Open Access Hub, you will need to enter your credentials in a file .netrc in your user home directory in the following form:

```
machine apihub.copernicus.eu
login <your_username>
password <your_password>
```

Getting a `401 Unauthorized` error means your credentials are wrong or not yet active.

## Client Side

### Installation

This project uses `NodeJS` and `npm` to run on your local computer.

To run the code, simply clone the github repository and install the dependencies using `npm`:

```bash
npm install
npm start
```

This will install the necessary dependencies and start the server. Once the server is running, you can access the GIS by navigating to http://localhost:portnumber in your web browser.

## Git Hooks

This project uses a formatter and a linter on the codebase.
Therefore, it is greatly recommended to use git hooks to enforce this behavior.

To do so, we use the `pre-commit` package, you just need to execute this command to get started:

```bash
pre-commit install
```
