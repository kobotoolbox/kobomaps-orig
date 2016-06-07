<?php
	//Paste here the unique document ID and sheet ID from Google Spreadsheets
	$googledoc_id 		= "19UdKQ5qGk5aYQkmP8hDuGlCncmFOZnvLVX1pgGD1hUY";
	$googledoc_sheet	= "788273502";
	$googledoc_range	= "A2:L2000";


	//Don't change anything below here
	$googledoc_url	= 'http://docs.google.com/spreadsheets/d/' . $googledoc_id . '/export?format=csv&id=' . $googledoc_id . '&gid='	. $googledoc_sheet . '&range=' . $googledoc_range;

	echo file_get_contents($googledoc_url);

?>