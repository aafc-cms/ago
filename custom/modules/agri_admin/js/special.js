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
          var editorContainer = $(".js-form-item-body-0-value .ck-editor__editable");

          var titleVal = $("#edit-title-0-value").val();
          if (editorContainer.find("#" + Special.spSpecialSelectorId).length === 0) {
            editorContainer.find("#" + Special.h1SpecialId).html(titleVal);
          }
          else if (editorContainer.find("#" + Special.h1SpecialId).length === 0) {
            editorContainer.find("#" + Special.h1SpecialId).html(titleVal);
          }
        }
      });
        //$("#edit-title-etuf-fr-0-value").keyup(function() {
      $(Special.otherLangTitleSelector).change(function() {
        if (Special.specialChecked) {
          var editorContainer = $(".js-form-item-body-0-value .ck-editor__editable");
          var titleValFr = $(Special.otherLangTitleSelector).val();
          if(editorContainer.find("#" + Special.spSpecialSelectorId).length === 0){
            editorContainer.find("#" + Special.h1SpecialId).html(titleValFr);
          }
          else if (Special.specialChecked) {
            editorContainer.find("#" + Special.h1SpecialId).html(titleValFr);
          }
        }
      });

      $("#edit-field-special-value").change(function() {
        var editorContainer = $(".js-form-item-body-0-value .ck-editor__editable");
        var editorOtherContainer = $(".js-form-item-body-etuf-fr-0-value .ck-editor__editable");
        //touche pas
        oldcontent = editorContainer.val();
        oldcontentother = editorOtherContainer.val();
        var imgplaceholder = '<div data-bgimg="https://design.canada.ca/coded-layout/images/theme-topic-img-825x200.jpg" class="mrgn-tp-xl wb-init wb-bgimg-inited" id="wb-auto-4" style="background-image: url(&quot;https://design.canada.ca/coded-layout/images/theme-topic-img-825x200.jpg&quot;);"></div>';
        if (Special.specialsettings.found_demo_topic) {
          var uuid = Special.specialsettings.media_uuid;
          var entity_id = Special.specialsettings.media_entity_id;
          //'drupal-media' adds 'Edit media' button to the image in edit mode. However the button renders improperly
          //if the image size is too big. So disable it for now.
          //imgplaceholder = '<drupal-media data-entity-type="media" data-entity-uuid="'+uuid+'" data-view-mode="w0825px"></drupal-media>';
        }
        oldtitle = $('#edit-title-0-value').val();
        oldtitleother = $(Special.otherLangTitleSelector).val();
        newcontent = '<div id="'+Special.spSpecialSelectorId+'" class="row profile"><div class="intro col-md-6 col-sm-12 mrgn-bttm-md"><h1 class="mrgn-tp-lg" property="name" id="'+Special.h1SpecialId+'">'+oldtitle+'</h1><p class="pagetag">1-2 sentences that describe the topics and top tasks that can be accessed on this page.</p></div><div class="col-md-6 mrgn-tp-sm hidden-sm hidden-xs provisional gc-topic-bg">'+imgplaceholder+'</div></div>';
        newcontentother = '<div id="'+Special.spSpecialSelectorId+'" class="row profile"><div class="intro col-md-6 col-sm-12 mrgn-bttm-md"><h1 class="mrgn-tp-lg" property="name" id="'+Special.h1SpecialId+'">'+oldtitleother+'</h1><p class="pagetag">1 ou 2 phrases d’introduction qui définissent les sous-sujets et les tâches principales qui peuvent être consultés sur cette page.</p></div><div class="col-md-6 mrgn-tp-sm hidden-sm hidden-xs provisional gc-topic-bg">'+imgplaceholder+'</div></div>';

        // when checking the special title checkbox
        if (this.checked) {
          Special.specialChecked = true;

          getCKEditorInstance("edit-body-0-value", function (editorInstance) {
            let currentContent = editorInstance.getData();

            if (currentContent.indexOf(Special.spSpecialSelectorId) === -1) {
              editorInstance.setData(newcontent + currentContent);
            }
          });

          getCKEditorInstance("edit-body-etuf-fr-0-value", function (editorInstance) {
            let currentContent = editorInstance.getData();

            if (currentContent.indexOf(Special.spSpecialSelectorId) === -1) {
              editorInstance.setData(newcontentother + currentContent);
            }
          });
        }

        // when unchecking the special title checkbox
        else {
          Special.specialChecked = false;

          getCKEditorInstance("edit-body-0-value", function (editorInstance) {
            let contentContainer = $("<div>").html(editorInstance.getData());
            contentContainer.find("#sp_special").remove();
            editorInstance.setData(contentContainer.html());
          });

          getCKEditorInstance(Special.otherLangBodySelector, function (editorInstance) {
            let contentContainer = $("<div>").html(editorInstance.getData());
            contentContainer.find("#sp_special").remove();
            editorInstance.setData(contentContainer.html());
          });
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

  function getCKEditorInstance(fieldId, callback, retries = 10) {
    let editorContainer = document.querySelector(`[data-drupal-selector="${fieldId}"] ~ .ck-editor`);

    if (editorContainer) {
      let editorInstance = editorContainer.querySelector(".ck-editor__editable").ckeditorInstance;

      if (editorInstance) {
        callback(editorInstance);
        return;
      }
    }

    // Retry if CKEditor 5 is not ready
    if (retries > 0) {
      setTimeout(() => getCKEditorInstance(fieldId, callback, retries - 1), 200);
    } else {
      console.error(`CKEditor 5 instance for ${fieldId} not found.`);
    }
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

