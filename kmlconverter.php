<?php

function handleError($errno, $errstr, $errfile, $errline, array $errcontext)
{
    // error was suppressed with the @-operator
    if (0 === error_reporting()) {
        return false;
    }

    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
}

/****************** If loading the page for the first time *********************************/

if(!$_FILES)
{
	showUI(null);
	exit;



}
/****************** When returning the JSON to the user *********************************/
else
{

	set_error_handler('handleError');

	try
	{
		
		// Where the file is going to be placed 
		$target_paths = array();
		$target_paths[0] = "uploaded_kml/"; //if it's just one file then use the first index

		//Add the original filename to our target path.  Result is "uploads/filename.extension" 
		$target_paths[0]  = $target_paths[0]  . time()."_".basename( $_FILES['uploadedfile']['name']);
		
		//move the file so it doesn't get deleted
		//echo $target_path . "<br/>". $_FILES['uploadedfile']['tmp_name']."<br/>".$_FILES['uploadedfile']['error'];
		//echo "<br/>";

		if(!move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $target_paths[0])) 
		{
		echo "There was an error uploading the file, please try again!";
		} 
		
		//get the name of the file, minus extention
		$info = pathinfo($_FILES['uploadedfile']['name']);
		$fileName =  basename($_FILES['uploadedfile']['name'],'.'.$info['extension']);
		

		//now we need to see if this is a KMZ file
		if(strtolower($info['extension']) == "kmz")
		{
			$zip = zip_open($target_paths[0]);
			if ($zip) 
			{
				$newTarget = array();
				$i = 0;
				while ($zip_entry = zip_read($zip)) 
				{
					$newTarget[$i] = "uploaded_kml/".zip_entry_name($zip_entry);				
					$fp = fopen($newTarget[$i], "w");
					if (zip_entry_open($zip, $zip_entry, "r")) 
					{
						$buf = zip_entry_read($zip_entry, zip_entry_filesize($zip_entry));
						fwrite($fp,"$buf");
						zip_entry_close($zip_entry);
						fclose($fp);
					}
					$i++;
				}
				zip_close($zip);
				unlink($target_paths[0]);
				$target_paths = $newTarget;
			}
		}
		
			
		
		


		

		//buffer out echo statements
		ob_start();
		//start up the output json
		echo '{"areas":[';
		
		foreach($target_paths as $target_path)
		{
			parseXml($target_path);
			unlink($target_path);
		}
		//close the "areas" 
		echo "]}";
		// Output to browser, make sure it gets saved to file
		header("Content-type: application/json");
		header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
		header("Content-Disposition: attachment; filename=" . $fileName . ".txt");
		//flush the buffer
		ob_flush();
	}
	catch(Exception $e)
	{
		ob_end_clean();
		showUI($e->getMessage());
	}
	
} //end else there are files

function parseXml($kmlUrl)
{
	$xml = simplexml_load_file($kmlUrl);
	
	//go straight to the placemarks
	$placemarks = $xml->Document->Placemark;
	$areasCount = 0;
	//loop over each area
	foreach($placemarks as $placemark)
	{
		$areasCount++;
		if($areasCount > 1)
		{
			echo ",";
		}
		parsePlacemark($placemark);		
	}
		
}


/**
 * Handles one specific area
 */
function parsePlacemark ($placemark)
{
	$cumaltive_lat = 0;
	$cumaltive_lon = 0;
	$count = 0;
	
	//startup the area, it's name and points
	echo '{"area":"'.strval($placemark->name[0]).'","points":[';
	
	
	
	//loop over all the polygons in the MultiGeometry
	$polygons = $placemark->MultiGeometry->Polygon;
	//check if they're using MultiGeometry
	if($polygons == null)
	{
		$polygons = $placemark->Polygon;
	}
	$polygonCount = 0;
	foreach($polygons as $polygon)
	{
		//handle commas
		$polygonCount++;
		if($polygonCount > 1)
		{
			echo ",";
		}
		
		//an array of points for a polygon
		echo "[";		
		
		//get the coordinates for each polygon
		$coordinatesStr = $polygon->outerBoundaryIs->LinearRing->coordinates[0];
		//split these up on spaces. What's left should read: longitude,latitude,altitude
		//$coordinateArray = explode (" ", $coordinatesStr);
		$coordinateArray =  preg_split('/\s+/', $coordinatesStr);
		
		$tripletsCount = 0;
		//now loop over these triplets
		$lastLat = -200;
		$lastLon = -200;
		foreach($coordinateArray as $cordTriplet)
		{			
			$subArray = explode(",", $cordTriplet);

			if(count($subArray)< 2)
			{
				continue;
			}

		
			
			$lon = doubleval($subArray[0]);
			$lat = doubleval($subArray[1]);
			//$alt = floatval($subArray[2]);
			
			
			
			
			if($_POST['decimals'] != 'none')
			{
				$roundedLat = round($lat, intval($_POST['decimals'] ));
				$roundedLon = round($lon, intval($_POST['decimals'] ));
			}
			else
			{
				$roundedLat = $lat;
				$roundedLon = $lon;
			}
			//skip duplicate points
			if($lastLat == $roundedLat AND $lastLon == $roundedLon)
			{
				continue;
			}
			
			//hanlde commas
			$tripletsCount++;
			if($tripletsCount > 1)
			{
				echo ",";
			}
			
			$lastLat = $roundedLat;
			$lastLon = $roundedLon;
			
			$count++;
			$cumaltive_lon = $cumaltive_lon + $lon;
			$cumaltive_lat = $cumaltive_lat + $lat;
			
			
			
			
			
			echo "[$roundedLat,$roundedLon]";
		}
		echo "]";
					
	}
	echo "],";
	//calculate center point
	if($count > 0)
	{
		$marker_lat = $cumaltive_lat / $count;
		$marker_lon = $cumaltive_lon / $count;
		echo '"marker":['.$marker_lat.','.$marker_lon.']}';
	}
	else
	{
		echo '"marker":[0,0]}';
	}

}//end function placePlacemark

function showUI($message = null)
{
?>
<!DOCTYPE html> 
<html> 
	<head>
		<title>KoBo - KML/KMZ to JSON</title>
		<link rel="stylesheet" type="text/css" href="css/xml.css"/>
	</head>
	
	<body>
		<h1>KoBo KML/KMZ to JSON converter</h1>
		<?php if($message != null) 
		{
			echo '<div style="background:#ffcccc;border:1px solid red;"> Error: ' . $message . '</div>';
		}
		?>
		<br/>			
		<form enctype="multipart/form-data" action="" method="POST">			
			Choose a KML/KMZ file to upload: <input name="uploadedfile" type="file" /><br />
			How many decimal places to round to: 
			<select name="decimals">
				<option value="none">Do not round</option>
				<option value="0">0</option>
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5</option>
				<option value="6">6</option>
				<option value="7">7</option>
			</select>
			<br/><br/>
			<input type="submit" value="Upload and Convert File" />			
		</form>
		
		<hr/>
		<h2>Where do I get KMZ/KML files?</h2>
		<p> 
			You can find KML and KMZ files for various countries here: 
			<a href="http://www.gadm.org/country">http://www.gadm.org/country</a>. 
			The files there will work with this converter.
		</p>
		<h2>What kind of data structure should my KML/KMZ have?</h2>		
		<p>The KML is expected to be formatted as follows</p>
		<div class="xmldiv">
			<span class="xml-processing">&lt;?xml </span><span class="xml-processing">version="1.0" encoding="UTF-8"?&gt;</span><br><span class="xml-punctuation">&lt;</span><span class="xml-tagname">kml </span><span class="xml-attname">xmlns</span><span class="xml-punctuation">=</span><span class="xml-attribute">"http://www.opengis.net/kml/2.2" </span><span class="xml-attname">xmlns:gx</span><span class="xml-punctuation">=</span><span class="xml-attribute">"http://www.google.com/kml/ext/2.2" </span><span class="xml-attname">xmlns:kml</span><span class="xml-punctuation">=</span><span class="xml-attribute">"http://www.opengis.net/kml/2.2" </span><span class="xml-attname">xmlns:atom</span><span class="xml-punctuation">=</span><span class="xml-attribute">"http://www.w3.org/2005/Atom"</span><span class="xml-punctuation">&gt;</span><br><span class="xml-punctuation">&lt;</span><span class="xml-tagname">Document</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">Placemark</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">name</span><span class="xml-punctuation">&gt;</span><span class="xml-text">Area1</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">name</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">MultiGeometry</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">Polygon</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">outerBoundaryIs</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">LinearRing</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">coordinates</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-text">-9,8,0 -10,8,0 -10,7,0 -9,7,0</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">coordinates</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">LinearRing</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">outerBoundaryIs</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">Polygon</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">MultiGeometry</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp;&nbsp;</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">Placemark</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">Placemark</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">name</span><span class="xml-punctuation">&gt;</span><span class="xml-text">Area2</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">name</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">MultiGeometry</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">Polygon</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">outerBoundaryIs</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">LinearRing</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">coordinates</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-text">-1,8,0 -2,8,0 -2,7,0 -1,7,0</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">coordinates</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">LinearRing</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">outerBoundaryIs</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">Polygon</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">Polygon</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">outerBoundaryIs</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">LinearRing</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;</span><span class="xml-tagname">coordinates</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-text">1,8,0 2,8,0 2,7,0 1,7,0</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">coordinates</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">LinearRing</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">outerBoundaryIs</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">Polygon</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp; &nbsp;&nbsp;</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">MultiGeometry</span><span class="xml-punctuation">&gt;</span><br><span class="whitespace">&nbsp;&nbsp;</span><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">Placemark</span><span class="xml-punctuation">&gt;</span><br><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">Document</span><span class="xml-punctuation">&gt;</span><br><span class="xml-punctuation">&lt;/</span><span class="xml-tagname">kml</span><span class="xml-punctuation">&gt;</span><span class="xml-text"></span>
		</div>
		

	</body>
</html>


<?php
}

?>