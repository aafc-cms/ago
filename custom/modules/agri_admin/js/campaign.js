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
        //touche pas
        oldcontent = CKEDITOR.instances["edit-body-0-value"].getData();
        oldcontentother = CKEDITOR.instances[Campaign.otherLangBodySelector].getData();
        var imgplaceholder = '<img src="https://www.canada.ca/content/dam/pch/images/campaigns/winterlude/2023/wl-web-top-banner-1920x300-EN.jpg" alt="" class="pull-right img-responsive thumbnail">';
        if (Campaign.campaignsettings.found_demo_topic) {
          var uuid = Campaign.campaignsettings.media_uuid;
          var entity_id = Campaign.campaignsettings.media_entity_id;
          imgplaceholder = '<drupal-media data-entity-type="media" data-entity-uuid="'+uuid+'" data-view-mode="w0520px"></drupal-media>';
        }
        oldtitle = $('#edit-title-0-value').val();
        oldtitleother = $(Campaign.otherLangTitleSelector).val();
        newcontent = '<div id="'+Campaign.spCampaignSelectorId+'" class="row profile"><div class="col-md-6"><h1 class="mrgn-tp-sm" property="name" id="'+Campaign.h1CampaignId+'">'+oldtitle+'</h1><p>1-2 sentences that describe the topics and top tasks that can be accessed on this page.</p><section class="followus"><h2>Follow:</h2> <ul> <li><a href="https://www.facebook.com/CanadianAgriculture/" class="facebook gl-follow" rel="external"> <span class="wb-inv">Facebook</span></a></li> <li><a href="https://twitter.com/AAFC_Canada" class="twitter gl-follow" rel="external"> <span class="wb-inv">Twitter</span></a></li> <li><a href="https://www.linkedin.com/company/aafc-aac/?viewAsMember=true" class="linkedin gl-follow" rel="external"><span class="wb-inv">LinkedIn</span></a></li> <li><a href="https://www.youtube.com/user/AgricultureCanadaEng" class="youtube gl-follow" rel="external"><span class="wb-inv">YouTube</span></a></li> </ul></section></div><div class="col-md-6 mrgn-tp-sm hidden-sm hidden-xs">'+imgplaceholder+'</div></div>'
        newcontentother = '<div id="'+Campaign.spCampaignSelectorId+'" class="row profile"><div class="col-md-6"><h1 class="mrgn-tp-sm" property="name" id="'+Campaign.h1CampaignId+'">'+oldtitleother+'</h1><p>1 ou 2 phrases d’introduction qui définissent les sous-sujets et les tâches principales qui peuvent être consultés sur cette page.</p><section class="followus"><h2>Suivez&nbsp;:</h2> <ul> <li><a href="https://www.facebook.com/AgricultureCanadienne" class="facebook gl-follow" rel="external"> <span class="wb-inv">Facebook</span></a></li> <li><a href="https://twitter.com/AAC_Canada" class="twitter gl-follow" rel="external"> <span class="wb-inv">Twitter</span></a></li> <li><a href="https://www.linkedin.com/company/aafc-aac/?viewAsMember=true" class="linkedin gl-follow" rel="external"><span class="wb-inv">LinkedIn</span></a></li> <li><a href="https://www.youtube.com/user/AgricultureCanadaFra" class="youtube gl-follow" rel="external"><span class="wb-inv">YouTube</span></a></li> </ul> </section></div><div class="col-md-6 mrgn-tp-sm hidden-sm hidden-xs">'+imgplaceholder+'</div></div>'

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

