<?php

/**
 * @file
 * Recipients.
 */

// $to = "deepani.waidyaratne@canada.ca,j@7pro.ca";
// $to = "marc.gervais@canada.ca,laurie.bernardi@canada.ca,benoit.aupy@canada.ca";
$to = "aafc.mas-sam.aac@agr.gc.ca,marc.gervais@AGR.GC.CA,laurie.bernardi@AGR.GC.CA,benoit.aupy@AGR.GC.CA,deepani.waidyaratne@canada.ca";

// Catch $_POST, declare local variables and set defaults.
$formFields = ["rating", "message", "pagetitle", "pageurl"];

$cwd_ici = getcwd();

if (!getenv('HOME') && !getenv('HOMEDRIVE')) {
  putenv("HOME=" . $cwd_ici);
  $_ENV['HOME'] = $cwd_ici;
}


foreach ($formFields as $field) {
  $$field = isset($_POST[$field]) ? $_POST[$field] : "";
}

if (stripos($pagetitle, " - Agriculture and Agri-Food Canada (AAFC)") != 0) {
  $pagetitle = substr($pagetitle, 0, stripos($pagetitle, " - Agriculture and Agri-Food Canada (AAFC)"));
}
elseif (stripos($pagetitle, " - Agriculture et Agroalimentaire Canada (AAC)") != 0) {
  $pagetitle = substr($pagetitle, 0, stripos($pagetitle, " - Agriculture et Agroalimentaire Canada (AAC)"));
}

// When form was submitted, validate it and send email.
if (isset($_POST["submit"]) && ($rating == "Yes" || $rating == "No")) {

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
			<td><a href="' . $pageurl . '">' . htmlspecialchars($pagetitle) . '</a></td>
		</tr>
		<tr valign="top">
			<td>Was this information useful?</td>
			<td>' . htmlspecialchars($rating) . '</td>
		</tr>
		<tr valign="top">
			<td>Comments</td>
			<td>' . htmlspecialchars($message) . '</td>
		</tr>
	</table>
	
	</body>
	</html>';

  // Prepare and send the email.
  $subject = "Feedback: " . htmlspecialchars($pagetitle);
  $subject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

  $headers  = "MIME-Version: 1.0\r\n";
  $headers .= "Content-type: text/html; charset=UTF-8\r\n";
  $headers .= "From: aafc.mas-sam.aac@canada.ca";

  // Disable previous mailer, use Drupal mailer only.
  // $mail_sent = mail($to,$subject,$body,$headers);.
  $email_body = str_replace("'", "`", $body);
  $email_body = str_replace('"', '\"', $email_body);
  $subject_override = str_replace("'", "`", "Feedback: " . htmlspecialchars($pagetitle));

  $eval_command = ' --uri=https://agr.gc.ca \'$mailManager=\Drupal::service("plugin.manager.mail");' .
                '$langcode="en";' .
                '$send = 1;' .
                '$module = "agri_admin";' .
                '$key = "mac_feedback";' .
                '$params["format"] = "text/html";' .
                '$params["content_type"] = "text/html";' .
                '$params["charset"] = "UTF-8";' .
                '$params["message"]="' . $email_body . '";' .
                '$params["subject"]="' . $subject_override . '";' .
                '$to="' . $to . '";' .
                '$langcode = \Drupal::currentUser()->getPreferredLangcode();$send = true;' .
                '$result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);' .
                '($result["result"])?\Drupal::logger("mail-log")->notice("mail mac_feedback_form php sent email"):\Drupal::logger("mail-log")->error("Error, unable to send mail for mac_feedback_form.php handler");\'';
  // Call drush.
  exec(__DIR__ . '/../../../../../../../../vendor/bin/drush eval ' . $eval_command, $output, $rc);

  chdir($cwd_ici);
  // Disable debug mode.
  $debug = FALSE;
  if ($debug && $fp = fopen('debug.log', 'a')) {
    $bt = debug_backtrace();
    fwrite($fp, "\n");
    fwrite($fp, __DIR__ . '/../../../../../../../../vendor/bin/drush eval ' . $eval_command);
    fwrite($fp, "\n");
    fwrite($fp, 'debug=rc=' . print_r($rc, TRUE));
    fwrite($fp, "\n");
    fwrite($fp, 'debug=output=' . print_r($output, TRUE));
    fwrite($fp, "\n");
    fwrite($fp, 'debug=TEST Joseph');
    fwrite($fp, "\n");
    fclose($fp);
  }

  // Restore current script directory.
  chdir($cwd_ici);
  $mail_sent = TRUE;
  if (!empty($rc)) {
    // Process error code.
    $mail_sent = FALSE;
  }


  if ($mail_sent) {
    header("Location: " . $pageurl . "?s=s&success#rating");
  }
  else {
    header("Location: " . $pageurl . "?e=e&error#rating");
  }
}
