# kobomaps-orig
#### A simple tool for quickly displaying dozens or hundreds of data indicators by geographic region on a map
------------------------------

### Requirements
* PHP 5.4.x (with openssl extension enabled)
* Web server (such as Apache)

Note: an Internet connection is required even for testing on a local machine. kobomaps uses the Google Maps and Google Charts APIs. 

### Quick start - Windows users
1 Install and run WampServer (http://www.wampserver.com/en/) or another Web development environment that lets you test locally
    Note: WampServer is known to conflict with Skype at startup. Quit Skype completely, then restart Wamp.
1 Wamp will create a www directory, by default C:\wamp\www. Download https://github.com/kobotoolbox/kobomaps-orig/archive/master.zip and unzip it to this directory. You should now have a directory called C:\wamp\www\kobomaps-orig
1 Open your browser and open http://localhost/kobomaps-orig/maps/example/ 
1 Make changes to kobomaps-orig\maps\example\data.csv (using Excel or another spreadsheet editor) - the changes will be reflected on the map. 
1 Create a copy of the example directory to create a new map, e.g. 'liberia', then edit the different files to reflect your map. You will see it immediately at http://localhost/kobomaps-orig/maps/liberia/

### Details on default files
* data.csv: Contains the data of your map. Each line contains a different indicator. The first two columns are used to organize the indicators hierarchically, the third column contains the indicator name. Each region's data is in a separate column. The column header needs to match the exact name used in the boundaries.txt file
* boundaries.txt: Contains the geographic outline of all your regions in JSON format. KoBoMaps can display any region you define. The easiest way to create the outline is through kobomaps-orig\kmlconverter\kmlconverter.php
* config.php: Controls the major details of the map. The following should always be changed: name of the map, HTML page title, default zoom level, default X/Y coordinates for initial view. All other variabels can be changed for a specific map if needed, such as styling or custom JavaScript. 

