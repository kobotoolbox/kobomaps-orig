# kobomaps-orig
#### A simple tool for quickly displaying dozens or hundreds of data indicators by geographic region on a map
------------------------------

### Requirements
* NodeJs 10.0.0

Note: an Internet connection is required even for testing on a local machine. kobomaps uses the Google Maps and Google Charts APIs. 

### Quick start - Windows users
1. Install [NodeJS](https://nodejs.org/en/download/)
1. Download [this repository](https://github.com/kobotoolbox/kobomaps-orig/archive/master.zip) and unzip it to a directory.
1. Open a command prompt and navigate to the directory where you extracted the repository
1. run `npm i`
1. run `webpack-dev-server`
1. Open your browser and open [http://localhost:8080](http://localhost:8080)
1. Make changes to `data\data.csv` (using Excel or another spreadsheet editor) - the changes will be reflected on the map. 

### Details on default map files
Each individual map should be its own subdirectory inside [maps](maps/). To create a new map use the [maps/example](maps/example) directory as a template. Of the four files, the following three may need to be edited for a specific map: 

* [data.csv](data/data.csv): Contains the data of your map. Each line contains a different indicator. The first two columns are used to organize the indicators hierarchically, the third column contains the indicator name. Each region's data is in a separate column. The column header needs to match the exact name used in the boundaries.txt file
* [boundaries.txt](data/boundaries.txt): Contains the geographic outline of all your regions in JSON format. KoBoMaps can display any region you define. The easiest way to create the outline is through kobomaps-orig\kmlconverter\kmlconverter.php
* [config.json](data/config.php): Controls the major details of the map. The following should always be changed: name of the map, HTML page title, default zoom level, default X/Y coordinates for initial view. All other variabels can be changed for a specific map if needed, such as styling or custom JavaScript. 
