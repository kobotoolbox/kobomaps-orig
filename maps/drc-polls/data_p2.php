<?php
	//Paste here the unique document ID and sheet ID from Google Spreadsheets
	$googledoc_id 		= "1lFXgO4cFxkZ1Cx63qc9rDUVa14Trwrm-GGe0QuE-AsM";
	$googledoc_sheet	= "737545320";


	//Don't change anything below here
	$googledoc_url	= 'http://docs.google.com/spreadsheets/d/' . $googledoc_id . '/export?format=csv&id=' . $googledoc_id . '&gid='	. $googledoc_sheet ;

	echo file_get_contents($googledoc_url);

?>