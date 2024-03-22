/**
 * @file
 * Special behaviors.
 */
(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.Special = {
    attach: function (context, settings) {
      if (context == document) {
        Special.init();
      }
    }
  };
})(jQuery, Drupal, drupalSettings);


var Special = function() {
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
  var specialChecked = false;
  var otherLangBodySelector = 'edit-body-etuf-fr-0-value';
  var otherLangTitleSelector = '#edit-title-etuf-fr-0-value';
  var spSpecialSelector = '#sp_special';
  var spSpecialSelectorId = 'sp_special';
  var h1SpecialId = 'wb-cont';
  var h1Special = '#wb-cont';
  var specialsettings;

  /**
   * Initialization
   */
  function init() {
    if (initialized) {
      return;
    }
    // Get the current UI language
    $ = jQuery;
    Special.lang = $('html').attr('lang');

    //Determine the page type
    if ($('body').hasClass('path-admin')) {
      Special.page_type = 'admin'; // Other admin page.
    }
    if (Special.lang == 'fr') {
      Special.otherLang = 'en';
      Special.otherLangBodySelector = 'edit-body-etuf-en-0-value';
      Special.otherLangTitleSelector = '#edit-title-etuf-en-0-value';
    }

    Special.specialsettings = drupalSettings.special; 
    $(document).ready(function() {
    
      if ($("#edit-field-special-value").is(':checked')) {
        Special.specialChecked = true;
      }

      //$("#edit-title-0-value").keyup(function() {
      $("#edit-title-0-value").change(function() {
        if (Special.specialChecked) {
          var titleVal = $("#edit-title-0-value").val();
          if (CKEDITOR.instances["edit-body-0-value"].document.getById(Special.spSpecialSelectorId) != null) {
            CKEDITOR.instances["edit-body-0-value"].document.getById(Special.h1SpecialId).setHtml(titleVal);
          }
          else if (CKEDITOR.instances["edit-body-0-value"].document.getById(Special.h1SpecialId) != null) {
            CKEDITOR.instances["edit-body-0-value"].document.getById(Special.h1SpecialId).setHtml(titleVal);
          }
        }
      });
        //$("#edit-title-etuf-fr-0-value").keyup(function() {
      $(Special.otherLangTitleSelector).change(function() {
        if (Special.specialChecked) {
          var titleValFr = $(Special.otherLangTitleSelector).val();
          if(CKEDITOR.instances[Special.otherLangBodySelector].document.getById(Special.spSpecialSelectorId) != null){
            CKEDITOR.instances[Special.otherLangBodySelector].document.getById(Special.h1SpecialId).setHtml(titleValFr);
          }
          else if (Special.specialChecked) {
            CKEDITOR.instances[Special.otherLangBodySelector].document.getById(Special.h1SpecialId).setHtml(titleValFr);
          }
        }
      });

      $("#edit-field-special-value").change(function() {      
        //touche pas
        oldcontent = CKEDITOR.instances["edit-body-0-value"].getData();
        oldcontentother = CKEDITOR.instances[Special.otherLangBodySelector].getData();
        var imgplaceholder = '<img alt="#" src="https://design.canada.ca/coded-layout/images/theme-topic-img-825x200.jpg">';
        if (Special.specialsettings.found_demo_topic) {
          var uuid = Special.specialsettings.media_uuid;
          var entity_id = Special.specialsettings.media_entity_id;
          imgplaceholder = '<drupal-media data-entity-type="media" data-entity-uuid="'+uuid+'" data-view-mode="w0825px"></drupal-media>';
        }
        oldtitle = $('#edit-title-0-value').val();
        oldtitleother = $(Special.otherLangTitleSelector).val();
        newcontent = '<div id="'+Special.spSpecialSelectorId+'" class="row profile"><div class="intro col-md-6 col-sm-12 mrgn-bttm-md"><h1 property="name" id="'+Special.h1SpecialId+'">'+oldtitle+'</h1><p class="pagetag">1-2 sentences that describe the topics and top tasks that can be accessed on this page.</p><section class="followus"><h2>Follow:</h2> <ul> <li><a href="https://www.facebook.com/CanadianAgriculture/" class="facebook gl-follow" rel="external"> <span class="wb-inv">Facebook</span></a></li> <li><a href="https://twitter.com/AAFC_Canada" class="twitter gl-follow" rel="external"> <span class="wb-inv">Twitter</span></a></li> <li><a href="https://www.linkedin.com/company/aafc-aac/?viewAsMember=true" class="linkedin gl-follow" rel="external"><span class="wb-inv">LinkedIn</span></a></li> <li><a href="https://www.youtube.com/user/AgricultureCanadaEng" class="youtube gl-follow" rel="external"><span class="wb-inv">YouTube</span></a></li> </ul></section></div><div class="col-md-6 pstn-rght-md mrgn-tp-lg hidden-sm hidden-xs guidance-js-hide">'+imgplaceholder+'</div></div>';
        newcontentother = '<div id="'+Special.spSpecialSelectorId+'" class="row profile"><div class="intro col-md-6 col-sm-12 mrgn-bttm-md"><h1 property="name" id="'+Special.h1SpecialId+'">'+oldtitleother+'</h1><p class="pagetag">1 ou 2 phrases d’introduction qui définissent les sous-sujets et les tâches principales qui peuvent être consultés sur cette page.</p><section class="followus"><h2>Suivez&nbsp;:</h2> <ul> <li><a href="https://www.facebook.com/AgricultureCanadienne" class="facebook gl-follow" rel="external"> <span class="wb-inv">Facebook</span></a></li> <li><a href="https://twitter.com/AAC_Canada" class="twitter gl-follow" rel="external"> <span class="wb-inv">Twitter</span></a></li> <li><a href="https://www.linkedin.com/company/aafc-aac/?viewAsMember=true" class="linkedin gl-follow" rel="external"><span class="wb-inv">LinkedIn</span></a></li> <li><a href="https://www.youtube.com/user/AgricultureCanadaFra" class="youtube gl-follow" rel="external"><span class="wb-inv">YouTube</span></a></li> </ul> </section></div><div class="col-md-6 pstn-rght-md mrgn-tp-lg hidden-sm hidden-xs guidance-js-hide">'+imgplaceholder+'</div></div>';

        // when checking the special title checkbox
        if (this.checked) {
          Special.specialChecked = true;
          if (CKEDITOR.instances["edit-body-0-value"].document.getById(Special.spSpecialSelectorId) == null) {
            CKEDITOR.instances["edit-body-0-value"].setData(newcontent + oldcontent);
          }
          else{}
          if (CKEDITOR.instances[Special.otherLangBodySelector].document.getById(Special.spSpecialSelectorId) == null) {
            CKEDITOR.instances[Special.otherLangBodySelector].setData(newcontentother + oldcontentother);
          }
          else{}
        }

        // when unchecking the special title checkbox
        else {
          Special.specialChecked = false;
          if(CKEDITOR.instances["edit-body-0-value"].document.getById(Special.spSpecialSelectorId) != null) {
            CKEDITOR.instances["edit-body-0-value"].document.getById(Special.spSpecialSelectorId).remove();
          }
          else {}
          if (CKEDITOR.instances[Special.otherLangBodySelector].document.getById(Special.spSpecialSelectorId) != null) {
            CKEDITOR.instances[Special.otherLangBodySelector].document.getById(Special.spSpecialSelectorId).remove();
          }
          else {}
        }

      });
    });




    if (Special.page_type == 'admin') {
      $(document).on('mousemove', onMouseMove);
    }

    initialized = true;
  }


  /**
   * logCall().
   **/
  function logCall(funcName, force) {
    if (typeof data[funcName] == 'undefined') {
      Special.data[funcName] = 0;
    }
    if (typeof force == 'undefined') {
      force = false;
    }
    Special.data[funcName]++;
    var debug = true; // Debug is disabled.
    if (debug || force) {
      console.log(funcName + ' call:' + Special.data[funcName]);
    }
  }


  /**
   * Keep track of mouse movements.
   */
  function onMouseMove(event) {
    Special.mouse.x = event.clientX;
    Special.mouse.y = event.clientY;
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
    specialsettings : specialsettings,
    otherLangBodySelector: otherLangBodySelector,
    otherLangTitleSelector: otherLangTitleSelector,
    h1SpecialId: h1SpecialId,
    h1Special: h1Special,
    spSpecialSelector: spSpecialSelector,
    spSpecialSelectorId: spSpecialSelectorId,
    specialChecked: specialChecked
  }
}();

