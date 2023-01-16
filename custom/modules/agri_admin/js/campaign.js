/**
 * @file
 * Campaign behaviors.
 */
(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.Campaign = {
    attach: function (context, settings) {
      if (context == document) {
        Campaign.init();
      }
    }
  };
})(jQuery, Drupal, drupalSettings);


var Campaign = function() {
  var initialized = false;   // Flag to indicate that this class has been initialized
  var lang = 'en';           // Will be 'en' or 'fr' regardless of how the url segment is formed (currently eng or fra)
  var otherLang = 'fr';
  var mouse = {x:0, y:0};    // Tracks the mouse position
  var page_type = 'content';
  var data = [];
  var oldcontent;
  var oldcontentother;
  var newcontent;
  var newcontentother;
  var oldtitle;
  var oldtitleother;
  var campaignChecked = false;
  var otherLangBodySelector = 'edit-body-etuf-fr-0-value';
  var otherLangTitleSelector = '#edit-title-etuf-fr-0-value';
  var spCampaignSelector = '#sp_campaign';
  var spCampaignSelectorId = 'sp_campaign';
  var h1CampaignId = 'wb-cont';
  var h1Campaign = '#wb-cont';
  var campaignsettings;

  /**
   * Initialization
   */
  function init() {
    if (initialized) {
      return;
    }
    // Get the current UI language
    $ = jQuery;
    Campaign.lang = $('html').attr('lang');

    //Determine the page type
    if ($('body').hasClass('path-admin')) {
      Campaign.page_type = 'admin'; // Other admin page.
    }
    if (Campaign.lang == 'fr') {
      Campaign.otherLang = 'en';
      Campaign.otherLangBodySelector = 'edit-body-etuf-en-0-value';
      Campaign.otherLangTitleSelector = '#edit-title-etuf-en-0-value';
    }

    Campaign.campaignsettings = drupalSettings.campaign; 
    $(document).ready(function() {
    
      if ($("#edit-field-campaign-value").is(':checked')) {
        Campaign.campaignChecked = true;
      }

      //$("#edit-title-0-value").keyup(function() {
      $("#edit-title-0-value").change(function() {
        if (Campaign.campaignChecked) {
          var titleVal = $("#edit-title-0-value").val();
          if (CKEDITOR.instances["edit-body-0-value"].document.getById(Campaign.spCampaignSelectorId) != null) {
            CKEDITOR.instances["edit-body-0-value"].document.getById(Campaign.h1CampaignId).setHtml(titleVal);
          }
          else if (CKEDITOR.instances["edit-body-0-value"].document.getById(Campaign.h1CampaignId) != null) {
            CKEDITOR.instances["edit-body-0-value"].document.getById(Campaign.h1CampaignId).setHtml(titleVal);
          }
        }
      });
        //$("#edit-title-etuf-fr-0-value").keyup(function() {
      $(Campaign.otherLangTitleSelector).change(function() {
        if (Campaign.campaignChecked) {
          var titleValFr = $(Campaign.otherLangTitleSelector).val();
          if(CKEDITOR.instances[Campaign.otherLangBodySelector].document.getById(Campaign.spCampaignSelectorId) != null){
            CKEDITOR.instances[Campaign.otherLangBodySelector].document.getById(Campaign.h1CampaignId).setHtml(titleValFr);
          }
          else if (Campaign.campaignChecked) {
            CKEDITOR.instances[Campaign.otherLangBodySelector].document.getById(Campaign.h1CampaignId).setHtml(titleValFr);
          }
        }
      });

      $("#edit-field-campaign-value").change(function() {      

        const image_names = new Array(
          'wl_web_top_banner_1920x300_EN',
          'wl_web_top_banner_1920x300_FR',
          'wl_web_top_banner_960x300_EN',
          'wl_web_top_banner_960x300_EN',
          'wl_web_top_banner_500x250_EN',
          'wl_web_top_banner_500x250_FR',
          'calendar_events_EN',
          'calendar_events_FR',
          'winterlude_national_ice_carving_championship_EN',
          'winterlude_national_ice_carving_championship_FR',
          'winterlude_olg_logo_450x450_EN',
          'winterlude_olg_logo_450x450_FR',
          'winterlude_sites_EN',
          'winterlude_sites_FR',
          'icon-facebook-white-EN.png',
          'icon-facebook-white-FR.png',
          'icon-instagram-white-EN.png',
          'icon-instagram-white-FR.png',
          'icon-twitter-white-EN.png',
          'icon-twitter-white-FR.png',
          'icon-youtube-white-EN.png',
          'icon-youtube-white-FR.png',
          'Timhortons450x450-EN.jpg',
          'Timhortons450x450-FR.jpg',
          'WL2022_WelcomePageDeco_TopDarkBlue-EN.jpg',
          'WL2022_WelcomePageDeco_TopDarkBlue-FR.jpg'
        );
        var topBanner1920En = '';
        if (Campaign.campaignsettings.wl_web_top_banner_1920x300_EN.found) {
          console.log('wl-web-top-banner-1920x300-EN.jpg is found!');
	}
        //touche pas
        oldcontent = CKEDITOR.instances["edit-body-0-value"].getData();
        oldcontentother = CKEDITOR.instances[Campaign.otherLangBodySelector].getData();
        var imgplaceholder = '<img src="/modules/custom/agri_admin/campaign/images/wl-web-top-banner-1920x300-EN.jpg" alt="" class="pull-right img-responsive thumbnail">';
        if (Campaign.campaignsettings.found_demo_topic) {
          var uuid = Campaign.campaignsettings.media_uuid;
          var entity_id = Campaign.campaignsettings.media_entity_id;
          imgplaceholder = '<drupal-media data-entity-type="media" data-entity-uuid="'+uuid+'" data-view-mode="w0520px"></drupal-media>';
        }
        oldtitle = $('#edit-title-0-value').val();
        oldtitleother = $(Campaign.otherLangTitleSelector).val();
        newcontent = '<div id="'+Campaign.spCampaignSelectorId+'" class="reference parbase section">' +
`  <div class="cq-dd-paragraph">
  <div class="mwsgeneric_base_html_933058698 mwsgeneric-base-html parbase">

  <div class="row">
  <div class="col-xs-12 p-0"> <span data-pic="data-pic" data-alt="This is Winterlude!" data-class="img-responsive full-width" class="wb-init wb-pic-inited" id="wb-auto-2"> 
    <!-- Default image: <div [data-src]> with no data-media attribute is displayed when:
                        1. None of the other <div [data-src]> media queries match.
                        2. The browser doesn't support media queries --> 
    <span data-src="/modules/custom/agri_admin/campaign/images/wl-web-top-banner-500x250-EN.jpg"></span> 
    <!-- Images for browsers with CSS media query support --> 
    <span data-src="/modules/custom/agri_admin/campaign/images/wl-web-top-banner-500x250-EN.jpg" data-media="(min-width: 0px)"></span> <span data-src="/modules/custom/agri_admin/campaign/images/wl-web-top-banner-960x300-EN.jpg" data-media="(min-width: 500px)"></span> <span data-src="/modules/custom/agri_admin/campaign/images/wl-web-top-banner-1920x300-EN.jpg" data-media="(min-width: 960px)"></span> <span data-src="/modules/custom/agri_admin/campaign/images/wl-web-top-banner-1920x300-EN.jpg" data-media="(min-width: 1200px)"><img alt="This is Winterlude!" class="img-responsive full-width" src="/modules/custom/agri_admin/campaign/images/wl-web-top-banner-1920x300-EN.jpg"></span> 
    <!-- Fallback content for non-JS browsers. -->
    <noscript>
    <img src="/modules/custom/agri_admin/campaign/images/wl-web-top-banner-1920x300-EN.jpg" alt="">
    </noscript>
    </span> </div>
</div>
<div class="visible-xs visible-sm bg-dark bg-winterlude text-white brdr-rds-0 brdr-0 mrgn-bttm-0 row">
  <div class="col-md-12">
    <ul class="row list-unstyled mrgn-tp-sm mrgn-bttm-sm text-center">
      <li class="col-sm-4 col-xs-6 small"><a href="#example-campaigns-winterlude" class="text-white h5">Home<span class="wb-inv"> - Winterlude</span></a></li>
      <li class="col-sm-4 col-xs-6 small"><a href="#example-calendar-events" class="text-white h5">Calendar</a></li>
      <li class="col-sm-4 col-xs-6 small"><a href="#example-sites" class="text-white h5">Winterlude sites</a></li>
      <li class="col-sm-4 col-xs-6 small"><a href="#example-sculptures" class="text-white h5">Sculptures</a></li>
      <li class="col-sm-4 col-xs-6 small"><a href="#example-about" class="text-white h5">About</a></li>
      <li class="col-sm-4 col-xs-6 small"><a href="#example-media" class="text-white h5">Media</a></li>
    </ul>
  </div>
</div>
<div class="visible-md visible-lg bg-dark bg-winterlude text-white brdr-rds-0 brdr-0 mrgn-bttm-0 row">
  <div class="col-md-10 col-md-offset-1 mrgn-tp-md mrgn-bttm-md">
    <ul class="row list-unstyled mrgn-tp-sm mrgn-bttm-sm text-center small">
      <li class="col-md-2 h4 mrgn-tp-sm"><a href="#winterlude" class="text-white h5">Home<span class="wb-inv"> - Winterlude</span></a></li>
      <li class="col-md-2 h4 mrgn-tp-sm"><a href="#calendar-events" class="text-white h5">Calendar</a></li>
      <li class="col-md-2 h4 mrgn-tp-sm"><a href="#sites" class="text-white h5">Winterlude sites</a></li>
      <li class="col-md-2 h4 mrgn-tp-sm"><a href="#sculptures" class="text-white h5">Sculptures</a></li>
      <li class="col-md-2 h4 mrgn-tp-sm"><a href="#about" class="text-white h5">About</a></li>
      <li class="col-md-2 h4 mrgn-tp-sm"><a href="#media" class="text-white h5">Media</a></li>
    </ul>
  </div>
</div>


</div>
</div>
</div>
<div class="mwsgeneric-base-html parbase section">



<div class="row">
  <div class="col-md-10 col-md-offset-1 mrgn-tp-xl mrgn-bttm-xl">` +
'    <h1 property="name" id="'+Campaign.h1CampaignId+'" dir="ltr" class="winterlude mrgn-tp-md">'+oldtitle+'</h1>' +
`    <p>Winterlude has finally arrived! From February 3 to 20, 2023, rediscover the joys of winter activities with family and friends. Check out the calendar of events to find out more.</p>
    <p>Where true winter fun doesn’t freeze—THIS is Winterlude!</p>
    <section class="alert alert-info">
      <h2>Become a volunteer</h2>
      <p><a href="#volunteer-centre">Be a part of the Winterlude volunteer team</a> for a rewarding experience.</p>
    </section>
  </div>
</div>
<div class="row p-0">
  <div class="col-md-12 p-0"> <img alt="" src="/modules/custom/agri_admin/campaign/images/WL2022_WelcomePageDeco_TopDarkBlue-EN.jpg" class="full-width img-responsive"> </div>
</div>
<div class="row bg-dark bg-winterlude">
  <div class="col-md-10 col-md-offset-1 mrgn-tp-xl mrgn-bttm-lg">
    <h2 class="text-center mrgn-tp-md text-white">To see and do </h2><div class="row mrgn-tp-lg mrgn-bttm-lg wb-eqht wb-init wb-eqht-inited" id="wb-auto-3">
      <div class="col-md-4 mrgn-bttm-lg">
        <div class="well p-0 hght-inhrt"> <img class="img-responsive full-width" src="/modules/custom/agri_admin/campaign/images/winterlude-sites-EN.jpg" alt="Winterlude sites">
          <div class="panel brdr-rds-0 mrgn-bttm-0">
            <div class="panel-body eqht-trgt" style="vertical-align: top; min-height: 188px;">
              <h3 class="mrgn-tp-md"><a class="stretched-link" href="#example-sites">Winterlude sites</a></h3>
              <p>Explore the various sites located in Ottawa and Gatineau.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 mrgn-bttm-lg">
        <div class="well p-0 hght-inhrt"> <img class="img-responsive full-width" src="/modules/custom/agri_admin/campaign/images/calendar-events-EN.jpg" alt="Calendar of events">
          <div class="panel brdr-rds-0 mrgn-bttm-0">
            <div class="panel-body eqht-trgt" style="vertical-align: top; min-height: 188px;">
              <h3 class="mrgn-tp-md"><a class="stretched-link" href="#example-calendar-events">Calendar of events</a></h3>
              <p>Check out the full program.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 mrgn-bttm-lg">
        <div class="well p-0 hght-inhrt"> <img class="img-responsive full-width" src="/modules/custom/agri_admin/campaign/images/winterlude-national-ice-carving-championship-EN.jpg" alt="Winterlude National Ice-Carving Championship">
          <div class="panel brdr-rds-0 mrgn-bttm-0">
            <div class="panel-body eqht-trgt" style="vertical-align: top; min-height: 188px;">
              <h3 class="mrgn-tp-md"><a class="stretched-link" href="#example-sculptures">Winterlude National Ice-Carving Championship</a></h3>
              <p>From the National Capital Region, Canadian ice carvers compete in an exciting championship.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</div>
</div>
<div class="reference parbase section"><div class="cq-dd-paragraph"><div class="mwsgeneric_base_html_549236581 mwsgeneric-base-html parbase">

<div class="row bg-darker">
  <div class="col-md-10 col-md-offset-1 mrgn-tp-md mrgn-bttm-md">
    <ul class="row list-unstyled mrgn-tp-sm mrgn-bttm-sm text-center small">
      <li class="col-md-4 h4 mrgn-tp-sm"><a href="#site-map" class="text-white h5">Site map</a></li>
      <li class="col-md-4 h4 mrgn-tp-sm"><a href="#winterlude" class="text-white h5">Become a volunteer</a></li>
      <li class="col-md-4 h4 mrgn-tp-sm"><a href="#events-newsletter" class="text-white h5">Newsletter</a></li>
    </ul>
  </div>
</div>
<div class="row">
  <div class="col-md-10 col-md-offset-1">
    <div class="row">
      <div class="col-md-12">
        <h2 class="wb-inv">Partners</h2>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4 col-md-offset-1"><img alt="OLG" src="/modules/custom/agri_admin/campaign/images/winterlude-olg-logo-450x450-EN.png" class="full-width img-responsive"></div>
      <div class="col-xs-12 col-sm-6 col-md-4 col-md-offset-2"><img alt="Tim Hortons" src="/modules/custom/agri_admin/campaign/images/Timhortons450x450-EN.jpg" class="full-width img-responsive"></div>
    </div>
  </div>
</div>
<div class="row bg-darker">
  <div class="col-xs-12">
    <div class="wb-inview bar-demo wb-init wb-inview-inited" data-inview="bottom-bar" id="wb-auto-4" data-inviewstate="none">
      <div class="row">
        <div class="col-xs-offset-1 col-xs-10 col-sm-offset-2 col-sm-8 col-md-4 col-md-offset-4">
          <ul class="row list-unstyled text-center list-inline mrgn-tp-md mrgn-bttm-md">
            <li class="col-xs-3"><a href="https://www.facebook.com/capitalexperience"><img src="/modules/custom/agri_admin/campaign/images/icon-facebook-white-EN.png" alt="facebook"></a></li>
            <li class="col-xs-3"><a href="https://twitter.com/capital_exp"><img src="/modules/custom/agri_admin/campaign/images/icon-twitter-white-EN.png" alt="twitter"></a></li>
            <li class="col-xs-3"><a href="https://www.instagram.com/canadacapitalregion/"><img src="/modules/custom/agri_admin/campaign/images/icon-instagram-white-EN.png" alt="instagram"></a></li>
            <li class="col-xs-3"><a href="https://www.youtube.com/user/CdnHeritage"><img src="/modules/custom/agri_admin/campaign/images/icon-youtube-white-EN.png" alt="youtube"></a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

<!--bottom bar section-->
<div id="bottom-bar" class="wb-overlay modal-content overlay-def wb-bar-b wb-init wb-overlay-inited outside-off open" aria-hidden="false" role="dialog">
  <div class="col-xs-offset-1 col-xs-10 col-sm-offset-2 col-sm-8 col-md-4 col-md-offset-4">
    <ul class="row list-unstyled text-center list-inline mrgn-tp-sm center-block">
      <li class="col-xs-3"><a href="https://www.facebook.com/capitalexperience"><img src="/modules/custom/agri_admin/campaign/images/icon-facebook-white-EN.png" alt="facebook"></a></li>
      <li class="col-xs-3"><a href="https://twitter.com/capital_exp"><img src="/modules/custom/agri_admin/campaign/images/icon-twitter-white-EN.png" alt="twitter"></a></li>
      <li class="col-xs-3"><a href="https://www.instagram.com/canadacapitalregion/"><img src="/modules/custom/agri_admin/campaign/images/icon-instagram-white-EN.png" alt="instagram"></a></li>
      <li class="col-xs-3"><a href="https://www.youtube.com/user/CdnHeritage"><img src="/modules/custom/agri_admin/campaign/images/icon-youtube-white-EN.png" alt="youtube"></a></li>
    </ul>
  </div>
<button title="Close overlay" class="mfp-close overlay-close" type="button">×<span class="wb-inv"> Close overlay</span></button></div>


</div>
</div>
</div>
`;

// Ok Maintenant pour le français.

        newcontentother = '<div id="'+Campaign.spCampaignSelectorId+'" class="reference parbase section">' +
`  <div class="cq-dd-paragraph">
  <div class="mwsgeneric_base_html_933058698 mwsgeneric-base-html parbase">

  <div class="row">
  <div class="col-xs-12 p-0"> <span data-pic="data-pic" data-alt="C’est aussi ÇA le Bal de Neige!" data-class="img-responsive full-width" class="wb-init wb-pic-inited" id="wb-auto-2"> 
    <!-- Default image: <div [data-src]> with no data-media attribute is displayed when:
                        1. None of the other <div [data-src]> media queries match.
                        2. The browser doesn't support media queries --> 
    <span data-src="/modules/custom/agri_admin/campaign/images/wl-web-top-banner-500x250-FR.jpg"></span> 
    <!-- Images for browsers with CSS media query support --> 
    <span data-src="/modules/custom/agri_admin/campaign/images/wl-web-top-banner-500x250-FR.jpg" data-media="(min-width: 0px)"></span> <span data-src="/modules/custom/agri_admin/campaign/images/wl-web-top-banner-960x300-FR.jpg" data-media="(min-width: 500px)"></span> <span data-src="/modules/custom/agri_admin/campaign/images/wl-web-top-banner-1920x300-FR.jpg" data-media="(min-width: 960px)"></span> <span data-src="/modules/custom/agri_admin/campaign/images/wl-web-top-banner-1920x300-FR.jpg" data-media="(min-width: 1200px)"><img alt="C’est aussi ÇA le Bal de Neige!" class="img-responsive full-width" src="/modules/custom/agri_admin/campaign/images/wl-web-top-banner-1920x300-FR.jpg"></span> 
    <!-- Fallback content for non-JS browsers. -->
    <noscript>
    <img src="/modules/custom/agri_admin/campaign/images/wl-web-top-banner-1920x300-FR.jpg" alt="">
    </noscript>
    </span> </div>
</div>
<div class="visible-xs visible-sm bg-dark bg-winterlude text-white brdr-rds-0 brdr-0 mrgn-bttm-0 row">
  <div class="col-md-12">
    <ul class="row list-unstyled mrgn-tp-sm mrgn-bttm-sm text-center">
      <li class="col-sm-4 col-xs-6 small"><a href="#example-campaigns-winterlude" class="text-white h5">Home<span class="wb-inv"> - Winterlude</span></a></li>
      <li class="col-sm-4 col-xs-6 small"><a href="#example-calendar-events" class="text-white h5">Calendar</a></li>
      <li class="col-sm-4 col-xs-6 small"><a href="#example-sites" class="text-white h5">Winterlude sites</a></li>
      <li class="col-sm-4 col-xs-6 small"><a href="#example-sculptures" class="text-white h5">Sculptures</a></li>
      <li class="col-sm-4 col-xs-6 small"><a href="#example-about" class="text-white h5">About</a></li>
      <li class="col-sm-4 col-xs-6 small"><a href="#example-media" class="text-white h5">Media</a></li>
    </ul>
  </div>
</div>
<div class="visible-md visible-lg bg-dark bg-winterlude text-white brdr-rds-0 brdr-0 mrgn-bttm-0 row">
  <div class="col-md-10 col-md-offset-1 mrgn-tp-md mrgn-bttm-md">
    <ul class="row list-unstyled mrgn-tp-sm mrgn-bttm-sm text-center small">
      <li class="col-md-2 h4 mrgn-tp-sm"><a href="#winterlude" class="text-white h5">Home<span class="wb-inv"> - Winterlude</span></a></li>
      <li class="col-md-2 h4 mrgn-tp-sm"><a href="#calendar-events" class="text-white h5">Calendar</a></li>
      <li class="col-md-2 h4 mrgn-tp-sm"><a href="#sites" class="text-white h5">Winterlude sites</a></li>
      <li class="col-md-2 h4 mrgn-tp-sm"><a href="#sculptures" class="text-white h5">Sculptures</a></li>
      <li class="col-md-2 h4 mrgn-tp-sm"><a href="#about" class="text-white h5">About</a></li>
      <li class="col-md-2 h4 mrgn-tp-sm"><a href="#media" class="text-white h5">Media</a></li>
    </ul>
  </div>
</div>


</div>
</div>
</div>
<div class="mwsgeneric-base-html parbase section">



<div class="row">
  <div class="col-md-10 col-md-offset-1 mrgn-tp-xl mrgn-bttm-xl">` +
'    <h1 property="name" id="'+Campaign.h1CampaignId+'" dir="ltr" class="winterlude mrgn-tp-md">'+oldtitleother+'</h1>' +
`    <p><Le temps du Bal de Neige est enfin arrivé. Du 3 au 20 février 2023, retrouvez le plaisir des incontournables activités hivernales en famille et entre amis. Consultez le calendrier des activités pour en savoir davantage./p>
    <p>Là où les véritables plaisirs d'hiver ne gèlent pas… C’est aussi ÇA le Bal de Neige!
    <section class="alert alert-info">
      <h2>Devenez bénévole</h2>
      <p><a href="#centre-benevole">Joignez-vous à notre équipe de bénévoles</a> et vivez une expérience des plus enrichissantes.</p>
    </section>
  </div>
</div>
<div class="row p-0">
  <div class="col-md-12 p-0"> <img alt="" src="/modules/custom/agri_admin/campaign/images/WL2022_WelcomePageDeco_TopDarkBlue-FR.jpg" class="full-width img-responsive"> </div>
</div>
<div class="row bg-dark bg-winterlude">
  <div class="col-md-10 col-md-offset-1 mrgn-tp-xl mrgn-bttm-lg">
    <h2 class="text-center mrgn-tp-md text-white">À voir et à faire </h2><div class="row mrgn-tp-lg mrgn-bttm-lg wb-eqht wb-init wb-eqht-inited" id="wb-auto-3">
      <div class="col-md-4 mrgn-bttm-lg">
        <div class="well p-0 hght-inhrt"> <img class="img-responsive full-width" src="/modules/custom/agri_admin/campaign/images/winterlude-sites-FR.jpg" alt="sites du bal de neige">
          <div class="panel brdr-rds-0 mrgn-bttm-0">
            <div class="panel-body eqht-trgt" style="vertical-align: top; min-height: 188px;">
              <h3 class="mrgn-tp-md"><a class="stretched-link" href="#example-sites">Les sites du bal de neige</a></h3>
              <p>Explorez les divers sites  à Ottawa et Gatineau.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 mrgn-bttm-lg">
        <div class="well p-0 hght-inhrt"> <img class="img-responsive full-width" src="/modules/custom/agri_admin/campaign/images/calendar-events-FR.jpg" alt="Calendrier des activités">
          <div class="panel brdr-rds-0 mrgn-bttm-0">
            <div class="panel-body eqht-trgt" style="vertical-align: top; min-height: 188px;">
              <h3 class="mrgn-tp-md"><a class="stretched-link" href="#example-calendar-events">Calendrier des activités</a></h3>
              <p>Consultez la programmation complète.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 mrgn-bttm-lg">
        <div class="well p-0 hght-inhrt"> <img class="img-responsive full-width" src="/modules/custom/agri_admin/campaign/images/winterlude-national-ice-carving-championship-FR.jpg" alt="Championat nationale de sculpture sur glace du Bal de Neige">
          <div class="panel brdr-rds-0 mrgn-bttm-0">
            <div class="panel-body eqht-trgt" style="vertical-align: top; min-height: 188px;">
              <h3 class="mrgn-tp-md"><a class="stretched-link" href="#example-sculptures">Championnat national de sculpture sur glace du Bal de Neige</a></h3>
              <p>Des sculpteurs sur glace canadiens participent à un championnat des plus excitants dans la région de la capitale du Canada.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</div>
</div>
<div class="reference parbase section"><div class="cq-dd-paragraph"><div class="mwsgeneric_base_html_549236581 mwsgeneric-base-html parbase">

<div class="row bg-darker">
  <div class="col-md-10 col-md-offset-1 mrgn-tp-md mrgn-bttm-md">
    <ul class="row list-unstyled mrgn-tp-sm mrgn-bttm-sm text-center small">
      <li class="col-md-4 h4 mrgn-tp-sm"><a href="#plan-du-site" class="text-white h5">Plan du site</a></li>
      <li class="col-md-4 h4 mrgn-tp-sm"><a href="#benevole" class="text-white h5">Devenez bénévole</a></li>
      <li class="col-md-4 h4 mrgn-tp-sm"><a href="#infolettre" class="text-white h5">Infolettre</a></li>
    </ul>
  </div>
</div>
<div class="row">
  <div class="col-md-10 col-md-offset-1">
    <div class="row">
      <div class="col-md-12">
        <h2 class="wb-inv">Partners</h2>
      </div>
      <div class="col-xs-12 col-sm-6 col-md-4 col-md-offset-1"><img alt="OLG" src="/modules/custom/agri_admin/campaign/images/winterlude-olg-logo-450x450-FR.png" class="full-width img-responsive"></div>
      <div class="col-xs-12 col-sm-6 col-md-4 col-md-offset-2"><img alt="Tim Hortons" src="/modules/custom/agri_admin/campaign/images/Timhortons450x450-FR.jpg" class="full-width img-responsive"></div>
    </div>
  </div>
</div>
<div class="row bg-darker">
  <div class="col-xs-12">
    <div class="wb-inview bar-demo wb-init wb-inview-inited" data-inview="bottom-bar" id="wb-auto-4" data-inviewstate="none">
      <div class="row">
        <div class="col-xs-offset-1 col-xs-10 col-sm-offset-2 col-sm-8 col-md-4 col-md-offset-4">
          <ul class="row list-unstyled text-center list-inline mrgn-tp-md mrgn-bttm-md">
            <li class="col-xs-3"><a href="https://www.facebook.com/capitalexperience"><img src="/modules/custom/agri_admin/campaign/images/icon-facebook-white-FR.png" alt="facebook"></a></li>
            <li class="col-xs-3"><a href="https://twitter.com/capital_exp"><img src="/modules/custom/agri_admin/campaign/images/icon-twitter-white-FR.png" alt="twitter"></a></li>
            <li class="col-xs-3"><a href="https://www.instagram.com/canadacapitalregion/"><img src="/modules/custom/agri_admin/campaign/images/icon-instagram-white-FR.png" alt="instagram"></a></li>
            <li class="col-xs-3"><a href="https://www.youtube.com/user/CdnHeritage"><img src="/modules/custom/agri_admin/campaign/images/icon-youtube-white-FR.png" alt="youtube"></a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

<!--bottom bar section-->
<div id="bottom-bar" class="wb-overlay modal-content overlay-def wb-bar-b wb-init wb-overlay-inited outside-off open" aria-hidden="false" role="dialog">
  <div class="col-xs-offset-1 col-xs-10 col-sm-offset-2 col-sm-8 col-md-4 col-md-offset-4">
    <ul class="row list-unstyled text-center list-inline mrgn-tp-sm center-block">
      <li class="col-xs-3"><a href="https://www.facebook.com/capitalexperience"><img src="/modules/custom/agri_admin/campaign/images/icon-facebook-white-FR.png" alt="facebook"></a></li>
      <li class="col-xs-3"><a href="https://twitter.com/capital_exp"><img src="/modules/custom/agri_admin/campaign/images/icon-twitter-white-FR.png" alt="twitter"></a></li>
      <li class="col-xs-3"><a href="https://www.instagram.com/canadacapitalregion/"><img src="/modules/custom/agri_admin/campaign/images/icon-instagram-white-FR.png" alt="instagram"></a></li>
      <li class="col-xs-3"><a href="https://www.youtube.com/user/CdnHeritage"><img src="/modules/custom/agri_admin/campaign/images/icon-youtube-white-FR.png" alt="youtube"></a></li>
    </ul>
  </div>
<button title="Close overlay" class="mfp-close overlay-close" type="button">×<span class="wb-inv"> Close overlay</span></button></div>


</div>
</div>
</div>
`;
        // when checking the campaign title checkbox
        if (this.checked) {
          Campaign.campaignChecked = true;
          if (CKEDITOR.instances["edit-body-0-value"].document.getById(Campaign.spCampaignSelectorId) == null) {
            CKEDITOR.instances["edit-body-0-value"].setData(newcontent + oldcontent);
          }
          else{}
          if (CKEDITOR.instances[Campaign.otherLangBodySelector].document.getById(Campaign.spCampaignSelectorId) == null) {
            CKEDITOR.instances[Campaign.otherLangBodySelector].setData(newcontentother + oldcontentother);
          }
          else{}
        }

        // when unchecking the campaign title checkbox
        else {
          Campaign.campaignChecked = false;
          if(CKEDITOR.instances["edit-body-0-value"].document.getById(Campaign.spCampaignSelectorId) != null) {
            CKEDITOR.instances["edit-body-0-value"].document.getById(Campaign.spCampaignSelectorId).remove();
          }
          else {}
          if (CKEDITOR.instances[Campaign.otherLangBodySelector].document.getById(Campaign.spCampaignSelectorId) != null) {
            CKEDITOR.instances[Campaign.otherLangBodySelector].document.getById(Campaign.spCampaignSelectorId).remove();
          }
          else {}
        }

      });
    });




    if (Campaign.page_type == 'admin') {
      $(document).on('mousemove', onMouseMove);
    }

    initialized = true;
  }


  /**
   * logCall().
   **/
  function logCall(funcName, force) {
    if (typeof data[funcName] == 'undefined') {
      Campaign.data[funcName] = 0;
    }
    if (typeof force == 'undefined') {
      force = false;
    }
    Campaign.data[funcName]++;
    var debug = true; // Debug is disabled.
    if (debug || force) {
      console.log(funcName + ' call:' + Campaign.data[funcName]);
    }
  }


  /**
   * Keep track of mouse movements.
   */
  function onMouseMove(event) {
    Campaign.mouse.x = event.clientX;
    Campaign.mouse.y = event.clientY;
  }



  /**
   * Expose functions and variables
   */
  return {
    init: init,
    lang: lang,
    otherLang: otherLang,
    logCall: logCall,
    mouse: mouse,
    page_type: page_type,
    oldcontent: oldcontent,
    newcontent: newcontent,
    oldcontentother: oldcontentother,
    newcontentother: newcontentother,
    oldtitle : oldtitle,
    oldtitleother : oldtitleother,
    campaignsettings : campaignsettings,
    otherLangBodySelector: otherLangBodySelector,
    otherLangTitleSelector: otherLangTitleSelector,
    h1CampaignId: h1CampaignId,
    h1Campaign: h1Campaign,
    spCampaignSelector: spCampaignSelector,
    spCampaignSelectorId: spCampaignSelectorId,
    campaignChecked: campaignChecked
  }
}();

