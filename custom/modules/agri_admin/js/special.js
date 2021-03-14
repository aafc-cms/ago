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
  var mouse = {x:0, y:0};    // Tracks the mouse position
  var page_type = 'content';
  var data = [];
  var oldcontent;
  var oldcontentfr;
  var newcontent;
  var newcontentfr;
  var oldtitle;
  var oldtitlefr;

  /**
   * Initialization
   */
  function init() {
    if (initialized) {
      return;
    }

    $(document).ready(function() {
    
      if($("#wb-cont_en".length != 0)){
        //$("#edit-title-0-value").keyup(function() {
        $("#edit-title-0-value").change(function() {
          if(CKEDITOR.instances["edit-body-0-value"].document.getById('sp_special_en') != null){
            CKEDITOR.instances["edit-body-0-value"].document.getById('sp_special_en').remove();
            oldtitle = $("#edit-title-0-value").val();
            oldcontent = CKEDITOR.instances["edit-body-0-value"].getData();
            newcontent = '<div id="sp_special_en" class="row profile"><div class="col-md-6"><h1 property="name" id="wb-cont_en">'+oldtitle+'</h1><p>1-2 sentences that describe the topics and top tasks that can be accessed on this page.</p><section class="followus"><h2>Follow:</h2><ul><li><a href="#facebook" class="facebook wb-lbx wb-init wb-lbx-inited" id="wb-auto-4"><span class="wb-inv">Facebook</span></a></li><li><a href="#" class="twitter" rel="external"><span class="wb-inv">Twitter</span></a></li><li><a href="#youtube" class="youtube wb-lbx wb-init wb-lbx-inited" id="wb-auto-5"><span class="wb-inv">YouTube</span></a></li><li><a href="#" class="flickr" rel="external"><span class="wb-inv">Flickr</span></a></li><li><a href="#" class="pinterest" rel="external"><span class="wb-inv">Pinterest</span></a></li><li><a href="#" class="linkedin" rel="external"><span class="wb-inv">LinkedIn</span></a></li><li><a href="#" class="instagram" rel="external"><span class="wb-inv">Instagram</span></a></li><li><a href="#" class="rss" rel="external"><span class="wb-inv">RSS feed</span></a></li><li><a href="#" class="email" rel="external"><span class="wb-inv">Email subscription</span></a></li><li><a href="#" class="periscope" rel="external"><span class="wb-inv">Periscope</span></a></li></ul></section><section id="facebook" class="mfp-hide modal-dialog modal-content overlay-def"><header class="modal-header"><h2 class="modal-title">Facebook</h2></header><div class="modal-body"><ul class="list-unstyled lst-spcd"><li><a href="#" rel="external">[First Facebook account title]</a></li><li><a href="#" rel="external">[Second Facebook account title]</a></li></ul></div></section><section id="youtube" class="mfp-hide modal-dialog modal-content overlay-def"><header class="modal-header"><h2 class="modal-title">YouTube</h2></header><div class="modal-body"><ul class="list-unstyled lst-spcd"><li><a href="#" rel="external">[First YouTube account title]</a></li><li><a href="#" rel="external">[Second YouTube account title]</a></li><li><a href="#" rel="external">[Third YouTube account title]</a></li></ul></div></section></div><div class="col-md-6 mrgn-tp-sm hidden-sm hidden-xs"><img src="https://wet-boew.github.io/themes-dist/GCWeb/img/520x200.png" alt="" class="pull-right img-responsive thumbnail"></div></div>'
            CKEDITOR.instances["edit-body-0-value"].setData(newcontent + oldcontent);
        }
        });
      }
      if($("#wb-cont_fr".length != 0)){
        //$("#edit-title-etuf-fr-0-value").keyup(function() {
        $("#edit-title-etuf-fr-0-value").change(function() {
          if(CKEDITOR.instances["edit-body-etuf-fr-0-value"].document.getById('sp_special_fr') != null){
            CKEDITOR.instances["edit-body-etuf-fr-0-value"].document.getById('sp_special_fr').remove();
            oldtitlefr = $("#edit-title-etuf-fr-0-value").val();
            oldcontentfr = CKEDITOR.instances["edit-body-etuf-fr-0-value"].getData();
            newcontentfr = '<div id="sp_special_fr" class="row profile"><div class="col-md-6"><h1 property="name" id="wb-cont_fr">'+oldtitlefr+'</h1><p>1 ou 2 phrases d’introduction qui définissent les sous-sujets et les tâches principales qui peuvent être consultés sur cette page.</p><section class="followus"><h2>Suivez&nbsp;:</h2><ul><li><a href="#facebook" class="facebook wb-lbx wb-init wb-lbx-inited" id="wb-auto-4"><span class="wb-inv">Facebook</span></a></li><li><a href="#" class="twitter" rel="external"><span class="wb-inv">Twitter</span></a></li><li><a href="#youtube" class="youtube wb-lbx wb-init wb-lbx-inited" id="wb-auto-5"><span class="wb-inv">YouTube</span></a></li><li><a href="#" class="flickr" rel="external"><span class="wb-inv">Flickr</span></a></li><li><a href="#" class="pinterest" rel="external"><span class="wb-inv">Pinterest</span></a></li><li><a href="#" class="linkedin" rel="external"><span class="wb-inv">LinkedIn</span></a></li><li><a href="#" class="instagram" rel="external"><span class="wb-inv">Instagram</span></a></li><li><a href="#" class="rss" rel="external"><span class="wb-inv">Fil RSS</span></a></li><li><a href="#" class="email" rel="external"><span class="wb-inv">Abonnement par courriel</span></a></li><li><a href="#" class="periscope" rel="external"><span class="wb-inv">Periscope</span></a></li></ul></section><section id="facebook" class="mfp-hide modal-dialog modal-content overlay-def"><header class="modal-header"><h2 class="modal-title">Facebook</h2></header><div class="modal-body"><ul class="list-unstyled lst-spcd"><li><a href="#" rel="external">[Titre du premier compte Facebook]</a></li><li><a href="#" rel="external">[Titre du deuxième compte Facebook]</a></li></ul></div></section><section id="youtube" class="mfp-hide modal-dialog modal-content overlay-def"><header class="modal-header"><h2 class="modal-title">YouTube</h2></header><div class="modal-body"><ul class="list-unstyled lst-spcd"><li><a href="#" rel="external">[Titre du premier compte YouTube]</a></li><li><a href="#" rel="external">[Titre du deuxième compte YouTube]</a></li><li><a href="#" rel="external">[Titre du troisième compte YouTube]</a></li></ul></div></section></div><div class="col-md-6 mrgn-tp-sm hidden-sm hidden-xs"><img src="https://wet-boew.github.io/themes-dist/GCWeb/img/520x200.png" alt="" class="pull-right img-responsive thumbnail"></div></div>'
            CKEDITOR.instances["edit-body-etuf-fr-0-value"].setData(newcontentfr + oldcontentfr); 
          } 
        });
      }

      $("#edit-field-special-value").change(function() {      
        
        oldcontent = CKEDITOR.instances["edit-body-0-value"].getData();
        oldcontentfr = CKEDITOR.instances["edit-body-etuf-fr-0-value"].getData();
        oldtitle = $('#edit-title-0-value').val();
        oldtitlefr = $('#edit-title-etuf-fr-0-value').val();
        newcontent = '<div id="sp_special_en" class="row profile"><div class="col-md-6"><h1 property="name" id="wb-cont_en">'+oldtitle+'</h1><p>1-2 sentences that describe the topics and top tasks that can be accessed on this page.</p><section class="followus"><h2>Follow:</h2><ul><li><a href="#facebook" class="facebook wb-lbx wb-init wb-lbx-inited" id="wb-auto-4"><span class="wb-inv">Facebook</span></a></li><li><a href="#" class="twitter" rel="external"><span class="wb-inv">Twitter</span></a></li><li><a href="#youtube" class="youtube wb-lbx wb-init wb-lbx-inited" id="wb-auto-5"><span class="wb-inv">YouTube</span></a></li><li><a href="#" class="flickr" rel="external"><span class="wb-inv">Flickr</span></a></li><li><a href="#" class="pinterest" rel="external"><span class="wb-inv">Pinterest</span></a></li><li><a href="#" class="linkedin" rel="external"><span class="wb-inv">LinkedIn</span></a></li><li><a href="#" class="instagram" rel="external"><span class="wb-inv">Instagram</span></a></li><li><a href="#" class="rss" rel="external"><span class="wb-inv">RSS feed</span></a></li><li><a href="#" class="email" rel="external"><span class="wb-inv">Email subscription</span></a></li><li><a href="#" class="periscope" rel="external"><span class="wb-inv">Periscope</span></a></li></ul></section><section id="facebook" class="mfp-hide modal-dialog modal-content overlay-def"><header class="modal-header"><h2 class="modal-title">Facebook</h2></header><div class="modal-body"><ul class="list-unstyled lst-spcd"><li><a href="#" rel="external">[First Facebook account title]</a></li><li><a href="#" rel="external">[Second Facebook account title]</a></li></ul></div></section><section id="youtube" class="mfp-hide modal-dialog modal-content overlay-def"><header class="modal-header"><h2 class="modal-title">YouTube</h2></header><div class="modal-body"><ul class="list-unstyled lst-spcd"><li><a href="#" rel="external">[First YouTube account title]</a></li><li><a href="#" rel="external">[Second YouTube account title]</a></li><li><a href="#" rel="external">[Third YouTube account title]</a></li></ul></div></section></div><div class="col-md-6 mrgn-tp-sm hidden-sm hidden-xs"><img src="https://wet-boew.github.io/themes-dist/GCWeb/img/520x200.png" alt="" class="pull-right img-responsive thumbnail"></div></div>'
        newcontentfr = '<div id="sp_special_fr" class="row profile"><div class="col-md-6"><h1 property="name" id="wb-cont_fr">'+oldtitlefr+'</h1><p>1 ou 2 phrases d’introduction qui définissent les sous-sujets et les tâches principales qui peuvent être consultés sur cette page.</p><section class="followus"><h2>Suivez&nbsp;:</h2><ul><li><a href="#facebook" class="facebook wb-lbx wb-init wb-lbx-inited" id="wb-auto-4"><span class="wb-inv">Facebook</span></a></li><li><a href="#" class="twitter" rel="external"><span class="wb-inv">Twitter</span></a></li><li><a href="#youtube" class="youtube wb-lbx wb-init wb-lbx-inited" id="wb-auto-5"><span class="wb-inv">YouTube</span></a></li><li><a href="#" class="flickr" rel="external"><span class="wb-inv">Flickr</span></a></li><li><a href="#" class="pinterest" rel="external"><span class="wb-inv">Pinterest</span></a></li><li><a href="#" class="linkedin" rel="external"><span class="wb-inv">LinkedIn</span></a></li><li><a href="#" class="instagram" rel="external"><span class="wb-inv">Instagram</span></a></li><li><a href="#" class="rss" rel="external"><span class="wb-inv">Fil RSS</span></a></li><li><a href="#" class="email" rel="external"><span class="wb-inv">Abonnement par courriel</span></a></li><li><a href="#" class="periscope" rel="external"><span class="wb-inv">Periscope</span></a></li></ul></section><section id="facebook" class="mfp-hide modal-dialog modal-content overlay-def"><header class="modal-header"><h2 class="modal-title">Facebook</h2></header><div class="modal-body"><ul class="list-unstyled lst-spcd"><li><a href="#" rel="external">[Titre du premier compte Facebook]</a></li><li><a href="#" rel="external">[Titre du deuxième compte Facebook]</a></li></ul></div></section><section id="youtube" class="mfp-hide modal-dialog modal-content overlay-def"><header class="modal-header"><h2 class="modal-title">YouTube</h2></header><div class="modal-body"><ul class="list-unstyled lst-spcd"><li><a href="#" rel="external">[Titre du premier compte YouTube]</a></li><li><a href="#" rel="external">[Titre du deuxième compte YouTube]</a></li><li><a href="#" rel="external">[Titre du troisième compte YouTube]</a></li></ul></div></section></div><div class="col-md-6 mrgn-tp-sm hidden-sm hidden-xs"><img src="https://wet-boew.github.io/themes-dist/GCWeb/img/520x200.png" alt="" class="pull-right img-responsive thumbnail"></div></div>'

        // when checking the special title checkbox
        if(this.checked) {
          if(CKEDITOR.instances["edit-body-0-value"].document.getById('sp_special_en') == null){
            CKEDITOR.instances["edit-body-0-value"].setData(newcontent + oldcontent);
          }
          else{}
          if(CKEDITOR.instances["edit-body-etuf-fr-0-value"].document.getById('sp_special_fr') == null){
            CKEDITOR.instances["edit-body-etuf-fr-0-value"].setData(newcontentfr + oldcontentfr);
          }
          else{}
        }

        // when unchecking the special title checkbox
        else {
          if(CKEDITOR.instances["edit-body-0-value"].document.getById('sp_special_en') != null){
            CKEDITOR.instances["edit-body-0-value"].document.getById('sp_special_en').remove();
          }
          else {}
          if(CKEDITOR.instances["edit-body-etuf-fr-0-value"].document.getById('sp_special_fr') != null){
            CKEDITOR.instances["edit-body-etuf-fr-0-value"].document.getById('sp_special_fr').remove();
          }
          else {}
        }

      });
    });

    // Get the current UI language
    $ = jQuery;
    Special.lang = $('html').attr('lang');

    //Determine the page type
    if ($('body').hasClass('path-admin')) {
      Special.page_type = 'admin'; // Other admin page.
    }

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
    logCall: logCall,
    mouse: mouse,
    page_type: page_type,
    oldcontent: oldcontent,
    newcontent: newcontent,
    oldcontentfr: oldcontentfr,
    newcontentfr: newcontentfr,
    oldtitle : oldtitle,
    oldtitlefr : oldtitlefr
  }
}();

