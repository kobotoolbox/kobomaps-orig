<script type="text/javascript" language="javascript">
//create the JS variables for this specific map
var kmapTitle = "Indicator map USA";
var kmapsubFolder = "<?php echo kmapsubFolder; ?>"; //defining the subfolder - this is defined once in the container file
var kmapBoundaries = "boundaries/json_boundaries_usa.txt";    //relative to kmapsubFolder
var kmapData = "data/data_usa.csv";     //relative to kmapsubFolder
var kmapY = "40.4";
var kmapX = "-99.3";
var kmapZoom = 4; //zoom level as integer (no parentheses)
var kmapAllAdminAreas = "all areas"; //write here the text that will appear in the Legend ("Questionname (xxxx)"), e.g. 'all counties' or 'nationwide'
var kmapInfodivHeight = 300;
//modify the base setting for the Google chart here (if necessary)
var kmapInfochartWidth = 315; //if this number is changed, the legend div (which contains the national graph) also needs to be adjusted
var kmapInfochartBarHeight = 10; //these are numbers, not strings
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
+ '&chxl=0:|%25|25|50|75|100|1:';
// Defining the map styles in JSON format. 
// Use Google Maps API Styled Map Wizard (http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html) to create JSON code	
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