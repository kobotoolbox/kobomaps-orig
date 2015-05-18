<?php
/*
 * KoBoMaps --- mapheader.php
 * This file is referenced by each KoBoMap instance.
 * Any changes in this file will be visible across all maps. 
 * Map-specific header values should instead be entered into the respective map container file
 */
?>

<link href="<?php echo kmapPath ?>/css/largemap.css" type="text/css" rel="stylesheet">
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript">google.load('visualization', '1', {packages: ['corechart']});</script>
<script>

// Only calling jquery if it's not already present. This helps with embedding kobomaps into Drupal. 
if (typeof $ === 'undefined') {
  document.write('<script type="text/javascript" src="<?php echo kmapPath ?>/js/jquery.js"><\/script>');
}
</script>
<script type="text/javascript" src="<?php echo kmapPath ?>/js/dataVisualize.js"></script> 
<script type="text/javascript" src="<?php echo kmapPath ?>/js/jquery.address-1.4.min.js"></script> 
<script type="text/javascript" src="<?php echo kmapPath ?>/js/csvToArray.js"> </script>
<script type="text/javascript" src="<?php echo kmapPath ?>/js/dragresize.js"> </script> 
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"> </script>
 
<script type="text/javascript" src="<?php echo kmapPath ?>/js/label.js"> </script> 

<link href="custom.css" type="text/css" rel="stylesheet">
<title><?php echo $kmapPageTitle; ?></title>