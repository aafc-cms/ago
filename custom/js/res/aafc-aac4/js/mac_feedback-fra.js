document.getElementById("rating").innerHTML = '<form class="hidden-print" id="ratingform" action="/resources/prod/Internet-Internet/MISB-DGSIM/ATS-SEA/includes/mac_feedback_handler.php" method="post"><div class="row"><div class="col-md-8"><div id="postresult"></div><section class="panel panel-default"><header class="panel-heading"><h2 class="panel-title">Ces renseignements vous ont-ils été utiles?</h2></header><div class="panel-body"><label class="radio-inline"><input name="rating" value="Yes" id="Yes" type="radio" />Oui</label><label class="radio-inline"><input name="rating" value="No" id="No" type="radio" />Non</label><div class="form-group mrgn-tp-md"><label for="message">Aidez-nous à mieux répondre à vos besoins. S\'il vous plaît soumettre vos commentaires sur les améliorations que vous aimeriez voir.</label><textarea class="form-control" name="message" id="message" cols="80" rows="4"></textarea></div><input type="hidden" name="pagetitle" id="pagetitle" /><input type="hidden" name="pageurl" id="pageurl" /><input type="submit" name="submit" id="submit" value="Soumettre" class="btn btn-default" /></div></section></div></div></form>';

if(document.URL.indexOf("&success") != -1) {
	document.getElementById("postresult").innerHTML = '<div class="alert alert-success"><h2>Merci!</h2><p>Vos commentaires ont été envoyés.</p></div>';
	document.getElementById("Yes").disabled = true;
	document.getElementById("No").disabled = true;
	document.getElementById("message").disabled = true;
	document.getElementById("submit").disabled = true;
}
else if(document.URL.indexOf("&error") != -1) {
	document.getElementById("postresult").innerHTML = '<div class="alert alert-danger"><h2>Une erruer s\'est produite.</h2><p>Vos commentaires n\'ont pas été envoyés. Veuillez nous contacter directement à <a class="nowrap" href="mailto:aafc.mas-sam.aac@canada.ca">aafc.mas-sam.aac@canada.ca</a>.</p></div>';
	document.getElementById("Yes").disabled = true;
	document.getElementById("No").disabled = true;
	document.getElementById("message").disabled = true;
	document.getElementById("submit").disabled = true;
}
else {
	document.getElementById("ratingform").pagetitle.value = document.title;
	document.getElementById("ratingform").pageurl.value = document.URL;
}