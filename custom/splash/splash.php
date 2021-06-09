<?php
  $server_name = $_SERVER['SERVER_NAME'];
  $host = $_SERVER['HTTP_HOST'];
  $prod = FALSE;
  if (stripos($host, 'www-tmp.agr.gc.ca') >= 0 || stripos($host, 'agriculture.canada.ca') >= 0) {
    $prod = TRUE;
  }
  // Adobe Analytics JS library.
  $adobetm='//assets.adobedtm.com/launch-EN11c0261481f74c56b7656937bbd995e9-staging.min.js';
  if ($prod) {
    $adobetm='//assets.adobedtm.com/launch-EN0cf6c2810a2b48f8a4c36502a1b09541.min.js';
  }
?>
<!DOCTYPE html>
<!-- saved from url=(0022)https://www.agr.gc.ca/ -->
<html lang="en" class="js backgroundsize borderimage csstransitions fontface svg details progressbar meter no-mathml cors xlargeview"><!--<![endif]--><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<title>Language selection - Agriculture and Agri-Food Canada / Sélection de la langue - Agriculture et Agroalimentaire Canada</title>
<meta content="width=device-width,initial-scale=1" name="viewport">
<!-- Meta data -->
<meta property="description" content="Agriculture and Agri-Food Canada, the Government of Canada department responsible for information, research, technology, policies and programs for security of the food system, health of the environment and innovation for growth.">
<meta property="description" lang="fr" content="Agriculture et Agroalimentaire Canada, ministère fédéral responsable de l&#39;information sur les travaux de recherche, les technologies, les politiques et les programmes en matière de sécurité alimentaire, de santé de l&#39;environnement et d&#39;innovations propices à la croissance">
<meta property="dcterms:creator" content="Agriculture and Agri-Food Canada">
<meta property="dcterms:creator" lang="fr" content="Agriculture et Agroalimentaire Canada">
<meta property="dcterms:title" content="Agriculture and Agri-Food Canada">
<meta property="dcterms:title" lang="fr" content="Agriculture et Agroalimentaire Canada">
<meta property="dcterms:issued" title="W3CDTF" content="Date published (2015-07-31) / Date de publication (2015-07-31)">
<meta property="dcterms:modified" title="W3CDTF" content="Date modified (2015-07-31) / Date de modification (2015-07-31)">
<meta property="dcterms:subject" title="scheme" content="agriculture;agricultural policy; agri-food industry; crops; environment; farming; food safety; land management; scientific research; trade; water">
<meta property="dcterms:subject" lang="fr" title="scheme" content="agriculture; politique agriculture; industrie agro-alimentaire; cultures; environnement; exploitation agricole; sécurité alimentaire; gestion du territoire; recherche scientifique; commerce; eau">
<meta property="dcterms:language" title="ISO639-2" content="eng">
<meta property="dcterms:language" lang="fr" title="ISO639-2" content="fra">
<meta property="dcterms:service" content="AAFC-AAC">
<meta property="dcterms:accessRights" content="2">
<!-- Meta data-->
<!--[if gte IE 9 | !IE ]><!-->
<link rel="apple-touch-icon" sizes="57x57 72x72 114x114 144x144 150x150" class="wb-favicon" href="https://www.agr.gc.ca/res/gcweb/GCWeb/assets/favicon-mobile.png"><link href="https://www.agr.gc.ca/res/gcweb/GCWeb/assets/favicon.ico" rel="icon" type="image/x-icon" class="wb-init wb-favicon-inited">
<link rel="stylesheet" href="/core/assets/vendor/jquery.ui/themes/base/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
<link rel="stylesheet" href="/libraries/theme-gcweb-legacy/css/theme.min.css">
<!--<![endif]-->
<link rel="stylesheet" href="/libraries/theme-gcweb-legacy/css/messages.min.css">
<!--[if lt IE 9]>
		<link href="/res/gcweb/GCWeb/assets/favicon.ico" rel="shortcut icon" />
		<link rel="stylesheet" href="/res/gcweb/GCWeb/css/messages-ie.min.css" />
		<link rel="stylesheet" href="/res/gcweb/GCWeb/css/ie8-theme.min.css" />
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.js"></script>
		<script src="/res/gcweb/js/ie8-wet-boew.min.js"></script>
		<![endif]-->
<!--[if lte IE 9]>
		
		
		<![endif]-->
<noscript><link rel="stylesheet" href="./wet-boew/css/noscript.min.css" /></noscript>
<script src="<?php print $adobetm ?>"></script>
</head>
<body class="splash" vocab="http://schema.org/" typeof="WebPage">
<div id="bg">
<img src="/libraries/theme-gcweb-legacy/assets/sp-bg-2.jpg" alt="">
</div>
<main role="main">
<div class="sp-hb">
<div class="sp-bx col-xs-12">
<h1 property="name" class="wb-inv">Canada.ca</h1>
<div class="row">
<div class="col-xs-11 col-md-8">
<img src="/libraries/theme-gcweb-legacy/assets/sig-spl.svg" width="283" alt="Government of Canada / Gouvernement du Canada">
</div>
</div>
<div class="row">
<section class="col-xs-6 text-right">
<h2 class="wb-inv">Government of Canada</h2>
<p><a href="/en" class="btn btn-primary">English</a></p>
</section>
<section class="col-xs-6" lang="fr">
<h2 class="wb-inv">Gouvernement du Canada</h2>
<p><a href="/fr" class="btn btn-primary">Français</a></p>
</section>
</div>
</div>
<div class="sp-bx-bt col-xs-12">
<div class="row">
<div class="col-xs-7 col-md-8">
<a href="en/about-our-department/terms-and-conditions" class="sp-lk">Terms and conditions</a> <span class="glyphicon glyphicon-asterisk"></span> <a href="fr/propos-notre-ministere/avis" class="sp-lk" lang="fr">Avis</a>
</div>
<div class="col-xs-5 col-md-4 text-right mrgn-bttm-md">
<img src="/libraries/theme-gcweb-legacy/assets/wmms-spl.svg" width="127" alt="Symbol of the Government of Canada / Symbole du gouvernement du Canada">
</div>
</div>
</div>
</div>
</main>
<!--[if gte IE 9 | !IE ]><!-->
<script src="/libraries/wet-boew/js/i18n/en.min.js"></script><script src="/libraries/wet-boew/js/jquery/2.2.4/jquery.js"></script>
<script src="/libraries/wet-boew/js/wet-boew.min.js"></script><span id="wb-rsz" class="wb-init">&nbsp;</span>
<!--<![endif]-->
<!--[if lt IE 9]>
		<script src="/res/gcweb/js/ie8-wet-boew2.min.js"></script>
		
		<![endif]-->
<script src="/libraries/theme-gcweb-legacy/js/theme.min.js"></script>
<script type="text/javascript">_satellite.pageBottom();</script>
</body></html>