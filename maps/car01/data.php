﻿<?php
	//Paste here the unique document ID and sheet ID from Google Spreadsheets
	$googledoc_id 		= "1YZUZKczzf1Wc1EKcgqQy8qQf8J6XBt3lRy5WRC0vuNk";
	$googledoc_sheet	= "1991497889";



	//Don't change anything below here
	$googledoc_url	= 'http://docs.google.com/spreadsheets/d/' . $googledoc_id . '/export?format=csv&id=' . $googledoc_id . '&gid='	. $googledoc_sheet;

	echo file_get_contents($googledoc_url);

?>
