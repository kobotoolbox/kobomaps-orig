﻿<?php
	//Paste here the unique document ID and sheet ID from Google Spreadsheets
	$googledoc_id 		= "1dWscTwyl_ku8Eo73FQOY0iuJrxttGx68sPaELOurjBw";
	$googledoc_sheet	= "0";


	//Don't change anything below here
	$googledoc_url	= 'http://docs.google.com/spreadsheets/d/' . $googledoc_id . '/export?format=csv&id=' . $googledoc_id . '&gid='	. $googledoc_sheet ;
	echo file_get_contents($googledoc_url);

?>