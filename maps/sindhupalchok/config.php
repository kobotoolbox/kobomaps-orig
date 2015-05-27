<?php
/**
 * KoBoMaps --- config.php
 * This file controls the vital details of each map. 
 * It specifies the source data and the boundaries of the areas to be displayed,
 * and handles some required variables that need to be set, and offers a few more handles for the user to modify the map.
 * It currently specifies php AND JavaScript variables, so be careful not to change or delete the syntax.
 */
 
/**
 *   ####  Primary map-specific variables  ####
 *   These should be changed for every map
 * 
 * kmapPageTitle		- set the HTML page title of the map here (to appear on top of the browser window). 
 * kmapTitle 			- This will appear on top of the indicator box
 * kmapAllAdminAreas	- write here the text that will appear in the Legend ("Questionname (xxxx)"), e.g. 'all counties' or 'nationwide'
 * kmapY 				- add the Y coordinate in decimals to center the map (west is negative)
 * kmapX 				- add the X coordinate in decimals to center the map (south is negative)
 * kmapZoom  			- enter the initial zoom level as integer between 0 and 20 (no quotation marks) 
 *
 * This should look similar to the following:
 *
 *      	$kmapPageTitle = "Example Indicator KoBoMap U.S."; 
 *      	$kmapTitle = "Indicator map USA"; 
 *      	$kmapAllAdminAreas = "nationwide"; 
 *      	$kmapY = "40.4"; 
 *      	$kmapX = "-99.3"; 
 *      	$kmapZoom = 4; 
 */
 
/*Beginning primary map-specific variables*/
	$kmapPageTitle = "Nepal Earthquake Response - Sindhupalchok District Assessment"; 
	$kmapTitle = "Nepal Earthquake Response - Sindhupalchok District Assessment"; 
	$kmapAllAdminAreas = "Sindhupalchok"; 
	$kmapY = "27.94"; 
	$kmapX = "85.7"; 
	$kmapZoom = 10; 
/*End primary map-specific variables*/
	
	
	
/**
 *   ####  Optional map-specific variables  ####
 * These variables can be left at their default value
 * 
 * kmapBoundaries 				- name of boundaries file (must be inside the same folder as the index.php file)
 * kmapData 					- name of data file (must be inside the same folder as the index.php file)
 * kmapInfodivHeight 			- Adjust the height in pixels of the div container inside the interactive bubble
 *   
 * To adjust the design of Google Chart bar chart graphics (which are created by a long URL), you can change the next few variable.
 * (See http://code.google.com/apis/chart/image/docs/chart_wizard.html for documentation and wizardry)
 * 
 * kmapInfochartWidth			- if this number is changed, the legend div (which contains the national graph) also needs to be adjusted
 * kmapInfochartBarHeight		-
 * kmapInfochartBarHeightMargin	-
 * kmapInfochartchxsFont		-
 * kmapInfochart				-
 * 
 * To adjust the style of the Google Map underlying your polygons, you can define its styles in JSON format 
 * 
 * mapStyles					- Use Google Maps API Styled Map Wizard (http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html)
 * 
 *  
 */
?>
<script type="text/javascript" language="javascript">
	var kmapBoundaries = "boundaries.txt";
	var kmapData = "data.php";
	var kmapInfodivHeight = 300; 
	var kmapInfochartWidth = 315;
	var kmapInfochartBarHeight = 7; 
	var kmapInfochartBarHeightMargin = 2;
	var kmapInfochartchxsFont = 10;
	var kmapInfochart = 'http://chart.apis.google.com/chart?'
	+ 'chxs=0,676767,'+kmapInfochartchxsFont+',2,l,676767|1,393939,'+kmapInfochartchxsFont+',1,l,676767'
	+ '&chxt=x,y'
	+ '&chbh='+kmapInfochartBarHeight+','+kmapInfochartBarHeightMargin+',0'
	+ '&chs='+kmapInfochartWidth+'x<HEIGHT>'
	+ '&cht=bhs'
	+ '&chco=3E4E6E,CC0000'
	+ '&chg=25,0,5,9'
	+ '&chts=000000,13'
  + '&chds=a' //This enables autoscaling. See https://developers.google.com/chart/image/docs/data_formats#textformatautoscaling
	+ '&chxl=1:';

	var mapStyles = 
[
  {
    "featureType": "poi",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "administrative.country",
    "stylers": [
      { "color": "#ffffff" },
      { "visibility": "on" }
    ]
  },{
    "featureType": "road",
    "stylers": [
      { "visibility": "on" }
    ]
  },{
    "featureType": "landscape",
    "elementType": "geometry",
    "stylers": [
      { "lightness": -60 },
      { "hue": "#2bff00" },
      { "visibility": "on" },
      { "saturation": -61 }
    ]
  },{
    "featureType": "administrative.locality"  },{
    "featureType": "road.arterial",
    "stylers": [
      { "color": "#a39f6d" }
    ]
  },{
    "featureType": "administrative.country",
    "elementType": "geometry",
    "stylers": [
      { "weight": 3 }
    ]
  },{
  }
]
</script>
<?php
/**
 *   ####  Other map-specific includes  ####
 * 	 If you need other files or specifications to be included in your map (e.g. Facebook button JavaScript), paste it here.
 * 
 *  
 */
?>