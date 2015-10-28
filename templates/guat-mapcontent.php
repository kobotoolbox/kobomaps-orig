<?php
/*
 * KoBoMaps --- mapcontent.php
 * This file is referenced by each KoBoMap instance.
 * Any changes in this file will be visible across all maps. 
 * Map-specific content and design should instead be entered into the respective map container file
 *
 */
//Creating the navigation column containing all the links. The actual ul and li nested elements are all created by the JS code
?>

<script type="text/javascript">
	jQuery(document).ready(function(){
	    jQuery('#toggleLabels').live('click', function(event) {        
	         jQuery('.countylabel').toggle('hide');
	    });
	});
</script>

<div id="tabs">
	<ul>
		<li class="survey-link" id="old"><a href="../guatemala_old">Old regions</a></li>
		<li class="survey-link" id="new"><a href="../guatemala_new">New regions</a></li>
	</ul>

</div>

<input type='button' id='toggleLabels' value='Show / hide labels'>

<div id="maplinks"	>
	<h3 id="kmapTitle">&nbsp;</h3>
	<p>Click on a section name to display the indicator header, then click on the indicator header to show the indicator(s). Click on the indicator to display its data on the map.</p>
		<ul id="questionsindicators" class="questionsindicators" >	</ul>
	<p id="loadingtext">
	Please be patient while the map is loading.  
	</p>
</div>

<?php
//The background element containing the actual map
?>
<div id="map_canvas"></div>

<?php
//The legend
?>
<div id="topbar" class="drsElement drsMoveHandle"> 
	<div id="legend">

		<div id="legendtext">
			<span id="spanLegendText">Please select an indicator to display its data.</span>
		</div>
		<div id="legend_gradient">
			<div id="percentleft">
				
			</div>
			<div id="percentright">
				
			</div>
		</div>
		<div id="nationalaveragediv">
			<span id="nationalaveragelabel"></span>
			<span id="nationalaverageimg" ></span>
		</div>
        <div id="nationalIndicatorChart"></div>		
        <div id="sourcetext">
			<span id="sourcetextspan" style="display:none;"> Data Source:  
				<a id="sourceURL" href="" title=""></a>
				<span id="sourceNoURL"></span>
			</span>
        </div>
		<div id="poweredby">
		<a href="http://www.kobotoolbox.org" title="KoBoToolbox.org">powered by KoboToolbox</a>
		</div>
		</div>
<?php
//Powered by KoBoToolbox - Please be kind and leave a reference with a link to our website.
?>
	</div>
</div>

