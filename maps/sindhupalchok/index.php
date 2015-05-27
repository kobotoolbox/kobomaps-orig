<!DOCTYPE html> 
<html> 
<head> 
<?php
/**
 * KoBoMaps --- index.php
 * This is a country-specific container file.  
 * Anything inside the <body> should be written in the external mapcontent.php file so that it can be included by all maps. 
 * Anything inside the <head> should be written in the external mapheader.php file so that it can be included by all maps.
 * Only modify this file if you want this particular map to look different from the others on your server. 
 */

/* The system expects KoBoMaps to have each specific map files located in their own separate subfolders (e.g. domain.com/kobomaps/maps/liberia and domain.com/kobomaps/maps/argentina, etc.). 
 * The path to KoBoMaps can be changed (e.g. domain.com/mysurveydata, etc.) and will be recognized automatically based on this file's current path. 
 * IF you want *this* file (index.php) to be located in a different folder than the one that has your boundaries, data and config files, 
 *    you will need to specify the path to your KoBoMaps installation and the location of your boundary and data files manually.
 * In this case, edit it to reflect the full path without a trailing slash, relative to the domain root folder.
 * For example for domain.com/another/subfolder the line should be 
 *  		define("kmapPath", "/another/subfolder", true);
 *  		define("kmapInstance", "/another/subfolder/mycountry", true);
 * (Remember in this case to comment out the preceding lines)
 */
	define("kmapPath", dirname(dirname(dirname($_SERVER['PHP_SELF']))), true);
	define("kmapInstance", dirname($_SERVER['PHP_SELF'] ), true);
	//define("kmapPath", "/your/own/kobomapsPath", true);
	//define("kmap", "/your/own/dataAndBoundariesPath", true);

	include $_SERVER['DOCUMENT_ROOT'] . kmapInstance . "/config.php"; 
?>
<script type="text/javascript" language="javascript">
	var kmapPath = "<?php echo kmapPath; ?>";
	var kmapInstance = "<?php echo kmapInstance; ?>";
	var kmapTitle = "<?php echo $kmapTitle; ?>"; 
	var kmapAllAdminAreas = "<?php echo $kmapAllAdminAreas; ?>"; 
	var kmapY = "<?php echo $kmapY; ?>"; 
	var kmapX = "<?php echo $kmapX; ?>"; 
	var kmapZoom = <?php echo $kmapZoom; ?>; 
</script>
<?php include $_SERVER['DOCUMENT_ROOT'] . kmapPath . "/templates/nepalmapheader.php"; ?>
</head> 
<body>
<?php include $_SERVER['DOCUMENT_ROOT'] . kmapPath . "/templates/nepalmapcontent.php"; ?>  

//Adding CSS class for tabs

<script>
$(document).ready(function(){
    $("#sindhupalchok").addClass("active");
});
</script>

</body> 
</html> 