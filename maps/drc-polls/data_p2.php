<?php
	//Paste here the unique document ID and sheet ID from Google Spreadsheets
	$googledoc_id 		= "1lFXgO4cFxkZ1Cx63qc9rDUVa14Trwrm-GGe0QuE-AsM";
	$googledoc_sheet	= "1782370854";
	$googledoc_range	= "A3:AF1000";


	//Don't change anything below here
	$googledoc_url	= 'http://docs.google.com/spreadsheets/d/' . $googledoc_id . '/export?format=csv&id=' . $googledoc_id . '&gid='	. $googledoc_sheet . '&range=' . $googledoc_range;

	echo file_get_contents($googledoc_url);

?>