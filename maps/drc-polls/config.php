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
	$kmapPageTitle = "DRC Polling Project Data"; 
	$kmapTitle = "DRC Polling Project Map"; 
	$kmapAllAdminAreas = "All areas"; 
	$kmapY = "-0.631"; 
	$kmapX = "26.296"; 
	$kmapZoom = 7; 
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
	var kmapData = [
		{name: 'Baseline', url: "data_baseline.php"},
		{name: 'Poll1', url: "data_p1.php"},
		{name: 'Poll2', url: "data_p2.php"}
	];
	var kmapInfodivHeight = 300; 
	var kmapInfochartWidth = 315;
	var kmapInfochartBarHeight = 10; 
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
	+ '&chxl=1:';

	var mapStyles = 
	[
	  {
		featureType: "administrative.province",
		elementType: "all",
		stylers: [
		  { visibility: "off" }
		]
	  },{
		featureType: "poi",
		elementType: "all",
		stylers: [
		  { visibility: "off" }
		]
	  },{
		featureType: "road",
		elementType: "all",
		stylers: [
		  { visibility: "off" }
		]
	  },{
		featureType: "landscape",
		elementType: "geometry",
		stylers: [
		  { lightness: -60 },
		  { hue: "#91ff00" },
		  { visibility: "on" },
		  { saturation: -60 }
		]
	  },{
		featureType: "administrative.locality",
		elementType: "all",
		stylers: [
		  { saturation: -50 },
		  { invert_lightness: true },
		  { lightness: 52 }
		]
	  }
	]; 
</script>
<?php
/**
 *   ####  Other map-specific includes  ####
 * 	 If you need other files or specifications to be included in your map (e.g. Facebook button JavaScript), paste it here.
 * 
 *  
 */
?>

<script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=ra-4e2cb8e90252e50b"> </script> 
<script type="text/javascript" src="<?php echo kmapPath ?>/js/addthisbutton.js"> </script> 
<link href="custom.css" type="text/css" rel="stylesheet">
