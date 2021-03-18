document.getElementById("rating").innerHTML = '<form class="hidden-print" id="ratingform" action="/resources/prod/Internet-Internet/MISB-DGSIM/ATS-SEA/includes/mac_feedback_handler.php" method="post"><div class="row"><div class="col-md-8"><div id="postresult"></div><section class="panel panel-default"><header class="panel-heading"><h2 class="panel-title">Was this information useful?</h2></header><div class="panel-body"><label class="radio-inline"><input name="rating" value="Yes" id="Yes" type="radio" />Yes</label><label class="radio-inline"><input name="rating" value="No" id="No" type="radio" />No</label><div class="form-group mrgn-tp-md"><label for="message">Help us make this site better meet your needs. Please submit comments on improvements that you would like to see.</label><textarea class="form-control" name="message" id="message" cols="80" rows="4"></textarea></div><input type="hidden" name="pagetitle" id="pagetitle" /><input type="hidden" name="pageurl" id="pageurl" /><input type="submit" name="submit" id="submit" value="Submit" class="btn btn-default" /></div></section></div></div></form>';

if(document.URL.indexOf("&success") != -1) {
	document.getElementById("postresult").innerHTML = '<div class="alert alert-success"><h2>Thank you!</h2><p>Your feedback has been sent.</p></div>';
	document.getElementById("Yes").disabled = true;
	document.getElementById("No").disabled = true;
	document.getElementById("message").disabled = true;
	document.getElementById("submit").disabled = true;
}
else if(document.URL.indexOf("&error") != -1) {
	document.getElementById("postresult").innerHTML = '<div class="alert alert-danger"><h2>An error has occured.</h2><p>Your feedback has not been sent. Please contact us directly at <a class="nowrap" href="mailto:aafc.mas-sam.aac@canada.ca">aafc.mas-sam.aac@canada.ca</a>.</p></div>';
	document.getElementById("Yes").disabled = true;
	document.getElementById("No").disabled = true;
	document.getElementById("message").disabled = true;
	document.getElementById("submit").disabled = true;
}
else {
	document.getElementById("ratingform").pagetitle.value = document.title;
	document.getElementById("ratingform").pageurl.value = document.URL;
}