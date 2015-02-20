<?php
/*
*
* This file is referenced from within Drupal in html--node--nnn.tpl.php
* Any changes in this file will be visible in the Drupal across all fullscreen maps. 

* ###The file name and file location should not be modified.###

*
*/
?>

<link href="/<?php echo kmapsubFolder ?>/css/largemap.css" type="text/css" rel="stylesheet"> 
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript">google.load('visualization', '1', {packages: ['corechart']});</script>
<script type="text/javascript" src="/<?php echo kmapsubFolder ?>/js/jquery-1.5.1.min.js"></script> 
<script type="text/javascript" src="/<?php echo kmapsubFolder ?>/js/dataVisualize.js"> </script> 
<script type="text/javascript" src="/<?php echo kmapsubFolder ?>/js/jquery.address-1.4.min.js"></script> 
<script type="text/javascript" src="/<?php echo kmapsubFolder ?>/js/csvToArray.js"> </script>
<script type="text/javascript" src="/<?php echo kmapsubFolder ?>/js/dragresize.js"> </script> 
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"> </script>
 
<script type="text/javascript" src="/<?php echo kmapsubFolder ?>/js/label.js"> </script> 

<?php //addthis button references and settings (site-specific!) ?>
<script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=ra-4e2cb8e90252e50b"> </script> 
<script type="text/javascript" src="/<?php echo kmapsubFolder ?>/js/addthisbutton.js"> </script> 