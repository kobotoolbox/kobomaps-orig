<!DOCTYPE html> 
<html> 
<head> 
<?php
//defining the subfolder - relative to the document root (where the contents of the domain/subdomain point to, e.g. home/user/www)
define("kmapsubFolder", "kobomaps-orig", true);
//defining the name (and location, if not in the root of kmapsubFolder) of the config file for this map
define("kmapconfigFile", "config_usa.php", true);


//calling the config file with all the js goodness 
include $_SERVER['DOCUMENT_ROOT'] . "/" . kmapsubFolder . "/" . kmapconfigFile; 

//including the js and css file references
include $_SERVER['DOCUMENT_ROOT'] . "/" . kmapsubFolder . "/mapheader.php";    
//Anything inside the <head> should be written in the external mapsheader_....php file so that it can be included by Drupal or other pages.
?>
<title>Kobomap</title>
</head> 
<body onload="initialize()">
<?php
//This is the standalone testing page. 
//Anything inside the <body> should be written in the external mapcontent.php file so that it can be included by Drupal or other pages. 

include $_SERVER['DOCUMENT_ROOT'] . "/" . kmapsubFolder . "/mapcontent.php";

?>  
</body> 
</html> 

