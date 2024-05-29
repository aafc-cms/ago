/**
 * @file
 * AgriSource Moderated Content behaviors.
 */

 (function ($, Drupal) {
    'use strict';
    /**
     * Behavior description.
     */
    Drupal.behaviors.print_all_steps_of_program = {
      attach: function (context, settings) {
        if (context == document) {
          PrintAllStepsHelper.init();
        }
      }
    };
  } (jQuery, Drupal));
  
  var PrintAllStepsHelper = function() {
    var initialized = false;   // Flag to indicate that this class has been initialized
  
    /**
     * Initialization
     */
    function init() {
      if (initialized) {
        return;
      }
      selectActionDownloadPdf();
      initialized = true;
    }
  
    /*
    * Select Download PDF option from Action dropdown
    */
    function selectActionDownloadPdf() {
       document.getElementById("edit-action").value = "entity_print_pdf_download_action";
    }
  
    /**
     * Expose functions and variables
     */
     return {
      init: init,
      selectActionDownloadPdf: selectActionDownloadPdf,
    }
  }();
   