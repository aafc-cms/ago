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
  var oldcontentfr;
  var newcontent;
  var newcontentfr;
  var oldtitle;
  var oldtitlefr;
  var otherLangBodySelector = 'edit-body-etuf-fr-0-value';
  var otherLangTitleSelector = '#edit-title-etuf-fr-0-value';
  var spSpecialSelector = 'sp_special_en';
  var spSpecialSelectorOther = 'sp_special_fr';
  var h1SpecialId = 'wb-cont_en';
  var h1SpecialOtherId = 'wb-cont_fr';
  var h1Special = '#wb-cont_en';
  var h1SpecialOther = '#wb-cont_fr';
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
      spSpecialSelector = '#sp_special_fr';
      spSpecialSelectorOther = '#sp_special_en';
      spSpecialSelectorId = 'sp_special_fr';
      spSpecialSelectorOtherId = 'sp_special_en';
      h1Special = 'wb-cont_fr';
      h1SpecialOther = 'wb-cont_en';
    }

    Special.specialsettings = drupalSettings.special; 
    $(document).ready(function() {
    
      if($("#wb-cont_en".length != 0)){
        //$("#edit-title-0-value").keyup(function() {
        $("#edit-title-0-value").change(function() {
          if (CKEDITOR.instances["edit-body-0-value"].document.getById('sp_special_en') != null) {
            var titleVal = $("#edit-title-0-value").val();
            CKEDITOR.instances["edit-body-0-value"].document.getById('wb-cont_en').setHtml(titleVal);
          }
        });
      }
      if($("#wb-cont_fr".length != 0)){
        //$("#edit-title-etuf-fr-0-value").keyup(function() {
        $(Special.otherLangTitleSelector).change(function() {
          if(CKEDITOR.instances[Special.otherLangBodySelector].document.getById('sp_special_fr') != null){
            var titleValfr = $(Special.otherLangTitleSelector).val();
            CKEDITOR.instances[Special.otherLangBodySelector].document.getById('wb-cont_fr').setHtml(titleValfr);
          }
        });
      }

      $("#edit-field-special-value").change(function() {      
        //touche pas
        oldcontent = CKEDITOR.instances["edit-body-0-value"].getData();
        oldcontentfr = CKEDITOR.instances["edit-body-etuf-fr-0-value"].getData();
        var imgplaceholder = '<img src="https://wet-boew.github.io/themes-dist/GCWeb/img/520x200.png" alt="" class="pull-right img-responsive thumbnail">';
        if (Special.specialsettings.found_demo_topic) {
          var uuid = Special.specialsettings.media_uuid;
          var entity_id = Special.specialsettings.media_entity_id;
          imgplaceholder = '<drupal-media data-entity-type="media" data-entity-uuid="'+uuid+'" data-view-mode="w0520px"></drupal-media>';
        }
        oldtitle = $('#edit-title-0-value').val();
        oldtitlefr = $(Special.otherLangTitleSelector).val();
        newcontent = '<div id="sp_special_en" class="row profile"><div class="col-md-6"><h1 property="name" id="wb-cont_en">'+oldtitle+'</h1><p>1-2 sentences that describe the topics and top tasks that can be accessed on this page.</p><section class="followus"><h2>Follow:</h2> <ul> <li><a href="https://www.facebook.com/CanadianAgriculture/" class="facebook gl-follow" rel="external"> <span class="wb-inv">Facebook</span></a></li> <li><a href="https://twitter.com/AAFC_Canada" class="twitter gl-follow" rel="external"> <span class="wb-inv">Twitter</span></a></li> <li><a href="https://www.linkedin.com/company/aafc-aac/?viewAsMember=true" class="linkedin gl-follow" rel="external"><span class="wb-inv">LinkedIn</span></a></li> <li><a href="https://www.youtube.com/user/AgricultureCanadaEng" class="youtube gl-follow" rel="external"><span class="wb-inv">YouTube</span></a></li> </ul></section></div><div class="col-md-6 mrgn-tp-sm hidden-sm hidden-xs">'+imgplaceholder+'</div></div>'
        newcontentfr = '<div id="sp_special_fr" class="row profile"><div class="col-md-6"><h1 property="name" id="wb-cont_fr">'+oldtitlefr+'</h1><p>1 ou 2 phrases d’introduction qui définissent les sous-sujets et les tâches principales qui peuvent être consultés sur cette page.</p><section class="followus"><h2>Suivez&nbsp;:</h2> <ul> <li><a href="https://www.facebook.com/AgricultureCanadienne" class="facebook gl-follow" rel="external"> <span class="wb-inv">Facebook</span></a></li> <li><a href="https://twitter.com/AAC_Canada" class="twitter gl-follow" rel="external"> <span class="wb-inv">Twitter</span></a></li> <li><a href="https://www.linkedin.com/company/aafc-aac/?viewAsMember=true" class="linkedin gl-follow" rel="external"><span class="wb-inv">LinkedIn</span></a></li> <li><a href="https://www.youtube.com/user/AgricultureCanadaFra" class="youtube gl-follow" rel="external"><span class="wb-inv">YouTube</span></a></li> </ul> </section></div><div class="col-md-6 mrgn-tp-sm hidden-sm hidden-xs">'+imgplaceholder+'</div></div>'

        // when checking the special title checkbox
        if(this.checked) {
          if(CKEDITOR.instances["edit-body-0-value"].document.getById('sp_special_en') == null){
            CKEDITOR.instances["edit-body-0-value"].setData(newcontent + oldcontent);
          }
          else{}
          if(CKEDITOR.instances[Special.otherLangBodySelector].document.getById('sp_special_fr') == null){
            CKEDITOR.instances[Special.otherLangBodySelector].setData(newcontentfr + oldcontentfr);
          }
          else{}
        }

        // when unchecking the special title checkbox
        else {
          if(CKEDITOR.instances["edit-body-0-value"].document.getById('sp_special_en') != null){
            CKEDITOR.instances["edit-body-0-value"].document.getById('sp_special_en').remove();
          }
          else {}
          if(CKEDITOR.instances[Special.otherLangBodySelector].document.getById('sp_special_fr') != null){
            CKEDITOR.instances[Special.otherLangBodySelector].document.getById('sp_special_fr').remove();
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
    oldcontentfr: oldcontentfr,
    newcontentfr: newcontentfr,
    oldtitle : oldtitle,
    oldtitlefr : oldtitlefr,
    specialsettings : specialsettings,
    otherLangBodySelector: otherLangBodySelector,
    otherLangTitleSelector: otherLangTitleSelector,
    spSpecialSelector: spSpecialSelector,
    spSpecialSelectorOther: spSpecialSelectorOther,
    spSpecialSelectorId: spSpecialSelectorId,
    spSpecialSelectorOtherId: spSpecialSelectorOtherId,
  }
}();

