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
<div id="maplinks"	>
	<h3 id="kmapTitle">&nbsp;</h3>
	<p>Click on a section name to display the questions, then click on the questions to show the indicator(s). Click on the indicator to display its data on the map.</p>
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
<div id="topbar" class="drsElement drsMoveHandle" style="left:355px; top: 60px;"> 
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
<!---		<div id="addthiswrappertop">
			<div class="addthis_toolbox addthis_default_style ">
				<a class="addthis_button_preferred_1"></a>
				<a class="addthis_button_preferred_2"></a>
				<a class="addthis_button_google_plusone" g:plusone:count="false"></a>
				<a class="addthis_button_preferred_3"></a>
				<a class="addthis_button_compact"></a>
				<a class="addthis_counter addthis_bubble_style"></a>
			</div> -->
		<div id="poweredby">
		<a href="http://www.kobotoolbox.org" title="KoBoToolbox.org">powered by KoboToolbox</a>
		</div>
		</div>
<?php
//Powered by KoBoToolbox - Please be kind and leave a reference with a link to our website.
?>
	</div>
</div>