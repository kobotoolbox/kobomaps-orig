<?php
	//Paste here the unique document ID and sheet ID from Google Spreadsheets
	$googledoc_id 		= "1-4_v0SXMzykc-d1KYIwFHoRz3Ix_18cuRBuaBJNRGCg";
	$googledoc_sheet	= "1151668723";
	$googledoc_range	= "A1:Z2000";


	//Don't change anything below here
	$googledoc_url	= 'http://docs.google.com/spreadsheets/d/' . $googledoc_id . '/export?format=csv&id=' . $googledoc_id . '&gid='	. $googledoc_sheet . '&range=' . $googledoc_range;

	echo file_get_contents($googledoc_url);

?>