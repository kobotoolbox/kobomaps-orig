<?php
	//Paste here the unique document ID and sheet ID from Google Spreadsheets
	$googledoc_id 		= "1Pl-C0tJRo3wWBXi8g9EfF85vTBSp8PF9B9z6HlqqwUE";
	$googledoc_sheet	= "1924588339";


	//Don't change anything below here
	$googledoc_url	= 'http://docs.google.com/spreadsheets/d/' . $googledoc_id . '/export?format=csv&id=' . $googledoc_id . '&gid='	. $googledoc_sheet ;

	echo file_get_contents($googledoc_url);

?>