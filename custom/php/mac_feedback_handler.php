<?php
// Recipients
$to = "deepani.waidyaratne@canada.ca";
//$to = "marc.gervais@canada.ca,laurie.bernardi@canada.ca,benoit.aupy@canada.ca";

// Catch $_POST, declare local variables and set defaults
$formFields = array("rating","message","pagetitle","pageurl");

foreach($formFields as $field) {
	$$field = isset($_POST[$field])?$_POST[$field]:"";
}

if(stripos($pagetitle, " - Agriculture and Agri-Food Canada (AAFC)") != 0) {
	$pagetitle = substr($pagetitle, 0, stripos($pagetitle, " - Agriculture and Agri-Food Canada (AAFC)"));
}
elseif(stripos($pagetitle, " - Agriculture et Agroalimentaire Canada (AAC)") != 0) {
	$pagetitle = substr($pagetitle, 0, stripos($pagetitle, " - Agriculture et Agroalimentaire Canada (AAC)"));
}

// When form was submitted, validate it and send email
if(isset($_POST["submit"]) && ($rating == "Yes" || $rating == "No")) {
	
	$body = '
	<html>
	<head>
	<style type="text/css">
		body {font-family:arial,helvetica,sans-serif;font-size:10pt;}
		td {font-family:arial,helvetica,sans-serif;font-size:10pt;}
	</style>
	</head>
	<body bgcolor="#FFFFFF">
	
	<table cellpadding="3" cellspacing="0" width="600" style="border: #000 1px solid">		
		<tr valign="top">
			<td>Page</td>
			<td><a href="'.$pageurl.'">'.htmlspecialchars($pagetitle).'</a></td>
		</tr>
		<tr valign="top">
			<td>Was this information useful?</td>
			<td>'.htmlspecialchars($rating).'</td>
		</tr>
		<tr valign="top">
			<td>Comments</td>
			<td>'.htmlspecialchars($message).'</td>
		</tr>
	</table>
	
	</body>
	</html>';

	// Prepare and send the email
	$subject = "Feedback: ".htmlspecialchars($pagetitle);
	$subject = '=?UTF-8?B?'.base64_encode($subject).'?=';
		
	$headers  = "MIME-Version: 1.0\r\n";
	$headers .= "Content-type: text/html; charset=UTF-8\r\n";
	$headers .= "From: aafc.mas-sam.aac@canada.ca";

	$mail_sent = mail($to,$subject,$body,$headers);

	if($mail_sent) {
		header("Location: ".$pageurl."&success#rating");
	}
	else {
		header("Location: ".$pageurl."&error#rating");
	}
}
?>