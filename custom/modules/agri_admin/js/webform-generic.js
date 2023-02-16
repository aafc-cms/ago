(function ($, Drupal) {
  Drupal.behaviors.wxtOrWetBoew = {
    attach: function (context, settings) {
      if (context == document) {
        if (!$('body').hasClass('path-webform')) {
          // Not a webform, do nothing.
          console.log('Not a webform, validated by wxtOrWetBoew');
          return;
        }
        if (WxtHelper.timeout > 0) {
          console.log('WxtHelper.init()');
          WxtHelper.init();
        }
      }
    }
  };
})(jQuery, Drupal);
var WxtHelper = function() {
  var errorHtml = '';
  var erroredElements = [];
  var erroredMessages = [];
  var initialized = false;
  var lang = 'en';
  var validationType = 'drupal';
  var wetboewFail = false;
  var timeout = 950000;
  function isReady() {
    var isReady = false;
    if (typeof $ == 'undefined') {
      $ = jQuery;
    }
    if ($('.wb-frmvld').length > 0 && WxtHelper.validationType == 'drupal') {
      console.log('WxtHelper.validationType = wet-boew');
      WxtHelper.validationType = 'wet-boew';
    }
    if (WxtHelper.validationType == 'wet-boew' &&
    $('.wb-frmvld').hasClass('wb-frmvld-inited') &&
    $('.wb-frmvld').hasClass('wb-init') &&
    ($('form section[id*=errors]').length == 1 || $('div.highlighted section.alert-danger').length == 1)) {
      if ($('div.highlighted section.alert-danger').length) {
        WxtHelper.wetboewFail = true;
        console.log('Form type is : ' + WxtHelper.validationType + ' : ? wet-boew not initialized correctly for some reason.');        
      }
      else {
        console.log('Form type is : ' + WxtHelper.validationType);
      }
      isReady = true;
    }
    else if(WxtHelper.validationType == 'drupal' && $('section.alert-danger').length > 0 && $('.form-item--error-message').length > 0) {
      WxtHelper.validationType = 'drupal';
      console.log('Form type is : ' + WxtHelper.validationType)
      isReady = true;
    }
    if (isReady) {
      console.log('isReady - Form type is : ' + WxtHelper.validationType);
      if (WxtHelper.timeout > 0) {
        console.log('isReady took ' + (950000 - WxtHelper.timeout) + ' milliseconds to complete');
      }
    }
    return isReady;
  };
  // Code you want to run when isReady conditions exist in the DOM.
  function onReady() {
    console.log('onReady()');

    if (WxtHelper.validationType == 'drupal') {
      WxtHelper.validationHelper();
      WxtHelper.makeErrorTitleLikeWetboew();
      WxtHelper.moveAlertInsideLabel();
      WxtHelper.setErrorElementsText();
      WxtHelper.moveErrors();
      // WCAG next three lines.
      $('section.alert-danger').removeAttr('role');
      $('section.alert-danger').attr('tabindex', '-1');
      $('section.alert-danger li a').first().trigger('focus');
    }
    else {
      // Make sure the event bindings do not accumulate, turn off first.
      WxtHelper.validationWetboew();
      WxtHelper.moveAlertInsideLabel();
      $('form.webform-submission-form').off('submit.wxthelper');
      $('form.webform-submission-form').once('submit.wxthelper', function() {
        // Re-initialize on submit.
        WxtHelper.timeout = 900000;
        WxtHelper.initialized = false;
        WxtHelper.init();
        setTimeout(function() {
          WxtHelper.moveAlertInsideLabel();
        }, 100);
      });
    }
  };
  // Contingency plan code you want to run if isReady conditions DO NOT exist in the DOM by timeout.
  function opt_onTimeout() {
    // Do nothing.
  };
  function addErrorToFieldset(item, index, arr) {
    console.log('addErrorToFieldset()');
    if (1) {
      // Disabled, still reviewing this.
      return;
    }
    if (WxtHelper.validationType == 'drupal' && (jQuery('fieldset' + item).length || $('fieldset' + item + '--wrapper').length)) {
      WxtHelper.errorHtml = '<div class="clearfix"></div><div class="form-item--error-message alert alert-danger alert-sm">' + WxtHelper.erroredMessages[index] + '</div>';
      if (jQuery('fieldset' + item).length || $('fieldset' + item + '--wrapper').length) {
        $('fieldset' + item + '--wrapper').find(item).prepend(WxtHelper.errorHtml);
        $('fieldset' + item).find(item+'radios').prepend(WxtHelper.errorHtml);
      }
      if (!$('fieldset' + item + '--wrapper').find('.alert-danger').length) {
        // Prepend the error message on the fieldset wrapper.
        $('fieldset' + item + '--wrapper').find(item).prepend(WxtHelper.errorHtml);
      }
      if (!$('fieldset' + item).find('.alert-danger').length) {
        // For Radios.
        // If the error html is not already added to the fieldset item, add it.
        $('fieldset' + item).find(item+'radios').prepend(WxtHelper.errorHtml);
      }
    }
  }
  function cleanErrorMessage(text, index) {
    if ($('section.alert-danger').hasClass('wxt-processed')) {
      // Prevent extra processing.
      return;
    }
    if ($('div.region-highlighed section.alert-danger').hasClass('wxt-processed')) {
      // Prevent over-processing.
      return;
    }
    if (text.indexOf('field is required') > 1 || text.indexOf('champ est requ') > 1) {
      return text;
    }
    var result = text;
    if (WxtHelper.validationType == 'wet-boew') {
      result = text + WxtHelper.requiredSuffix();
      if (WxtHelper.lang == 'fr') {
        result = result.replace('Ce field est requis', 'Ce champ est requis');
      }
    }
    else if (WxtHelper.validationType == 'drupal') {
      if (WxtHelper.lang == 'en') {
        text = "Error " + index + ": " + text + WxtHelper.requiredSuffix((index - 1));
      }
      else {
        text = "Erreur " + index + ": " + text + WxtHelper.requiredSuffix((index - 1));
      }
      result = text;
    }
    return result;
  }
  function requiredSuffix(index) {
    var found = false;
    if ($(erroredElements[index]).length == 1 &&
    ($(erroredElements[index]).get(0).tagName.toLowerCase() == 'input' ||
    $(erroredElements[index]).get(0).tagName.toLowerCase() == 'fieldset' ||
    $(erroredElements[index]).get(0).tagName.toLowerCase() == 'textarea')) {
      var searching = erroredElements[index];
      if ($(searching).is('[class*=radios]') ||
      $(searching).hasClass('form-email') ||
      $(searching).hasClass('form-text') ||
      $(searching).hasClass('form-textarea') ||
      $(searching).hasClass('form-tel')) {
        if (!found && $(searching).find('.alert-danger').length == 1) {
          msg = $(searching).find('.alert-danger').first().text();
          found = true;
        }
        else if (!found && $(searching).parent().find('.alert-danger').length == 1) {
          msg = $(searching).parent().find('.alert-danger').first().text();
          found = true;
        }
        else if (!found && $(searching).parent().parent().find('.alert-danger').length == 1) {
          msg = $(searching).parent().parent().find('.alert-danger').first().text();
          found = true;
        }
      }
    }
    if (!found) {
      msg = "This field is required.";
      if (WxtHelper.lang == 'fr') {
        msg = "Ce champ est requis.";
      }
    }
    return ' - ' + msg;
  }
  function requiredSuffixFormElement(index) {
    var msg = '';
    var prefix = 'Error ' + (index+1) + ' - ';
    if (WxtHelper.lang == 'fr') {
      prefix = 'Erreur ' + (index+1) + ' - ';
    }
    if ($(erroredElements[index]).length == 1 && $(erroredElements[index]).get(0).tagName.toLowerCase() == 'fieldset') {
      msg = $(erroredElements[index]).find('.alert.alert-danger').text();
    }
    else {
      if ($(erroredElements[index]).closest('.error.form-wrapper').length == 1) {
        msg = $(erroredElements[index]).closest('.error.form-wrapper').find('.alert.alert-danger').text();
      }
      else if ($(erroredElements[index]).closest('.error.has-error').length == 1) {
        msg = $(erroredElements[index]).closest('.error.has-error').find('.alert.alert-danger').text();
      }
      else if ($(erroredElements[index]).closest('.error.form-item').length == 1) {
        msg = $(erroredElements[index]).closest('.error.form-item').find('.alert.alert-danger').text();
      }
      else {
        msg = "This field is required.";
        if (WxtHelper.lang == 'fr') {
          msg = "Ce champ est requis.";
        }
      }
    }
    return prefix + msg;
  }
  function makeErrorTitleLikeWetboew(force) {
    if (typeof force == 'undefined') {
      force = false;
    }
    if (WxtHelper.validationType == 'drupal' || force) {
      var h2prefix = "The form could not be submitted because ";
      if (WxtHelper.lang == 'fr') {
        h2prefix = "Le formulaire n'a pu être soumis car ";
      }
      if ($("h2.sr-only").length == 1) {
        var original = $("h2.sr-only").next().text();
        $("h2.sr-only").text(h2prefix + original); // Set the error msg into h2
        $("h2.sr-only").next().remove(); // Remove extra html p element
      }
    }
  }
  function moveAlertInsideLabel() {
    console.log('moveAlertInsideLabel()');
    var textItem = 'div[class*=form-type-text], div.js-webform-states-hidden, div.form-item.has-error, .form-type-select.form-group';
    $(textItem).each(function(index, element) {
      var divAlert = $(this).find('.alert-danger').first();
      if ($(this).find(divAlert).length == 1) {
        var labelItem = $(this).find('label');
        var attachToThis = labelItem;
        var descriptionHelp = $(this).find('.description.help-block').first();
        var textarea = $(this).find('textarea').first();
        var textareaWrapper = $(this).find('.form-textarea-wrapper').first();
        if ($(descriptionHelp).length == 1) {
          attachToThis = descriptionHelp;
          $(divAlert).clone().insertBefore($(attachToThis));
          $(divAlert).remove();
        }
        else if ($(textarea).hasClass('required') && $(textareaWrapper).length == 1) {
          attachToThis = $(this).find('.form-textarea-wrapper');
          $(divAlert).clone().insertBefore($(attachToThis));
          $(divAlert).remove();
        }
        else if ($(this).hasClass('error') && $(this).find('.select-wrapper').length == 1) {
          attachToThis = $(this).find('.select-wrapper');
          $(divAlert).clone().insertBefore($(attachToThis));
          $(divAlert).remove();
        }
        else if (!$(this).hasClass('form-type-textarea') && $(this).find('.form-control').length == 1) {
          attachToThis = $(this).find('label.control-label');
          $(divAlert).clone().insertAfter($(attachToThis));
          $(divAlert).remove();
        }
      }
    });
    if (WxtHelper.validationType == 'wet-boew') {
      $(textItem).each(function(index, element) {
        var divAlert = $(this).find('strong.error').first();
        // DISABLED, LIKELY DO NOT NEED THIS HERE SECTION FOR WET-BOEW.
        if (0 && $(this).find(divAlert).length == 1) {
          var labelItem = $(this).find('label');
          var attachToThis = labelItem;
          var descriptionHelp = $(this).find('.description.help-block').first();
          var textarea = $(this).find('textarea').first();
          var textareaWrapper = $(this).find('.form-textarea-wrapper').first();
          if ($(descriptionHelp).length == 1) {
            attachToThis = descriptionHelp;
            $(divAlert).clone().appendTo($(attachToThis));
            $(divAlert).remove();
          }
          else if (!$(this).hasClass('form-type-textarea') && $(this).find('.form-control').length == 1) {
            attachToThis = $(this).find('label.control-label');
            $(divAlert).clone().appendTo($(attachToThis));
            $(divAlert).remove();
          }
          else if ($(textarea).hasClass('required') && $(textareaWrapper).length == 1) {
            attachToThis = $(this).find('.form-textarea-wrapper');
            $(divAlert).clone().prepend($(attachToThis));
            $(divAlert).remove();
          }
          else if ($(this).hasClass('error') && $(this).find('.select-wrapper').length == 1) {
            attachToThis = $(this).find('.select-wrapper');
            $(divAlert).clone().appendTo($(attachToThis));
            $(divAlert).remove();
          }
        }
      });
    }
  }
  function moveErrors() {
    var submit = '#edit-actions-submit';
    var force = false;
    if ($(submit).length == 1 && $(submit).is('[disabled]')) {
      force = true;
    }
    // Only needs to be done for validationType = drupal.
    if (WxtHelper.validationType == 'drupal' || force) {
      var highlightedSelector = 'div.highlighted';
      var firstErrorAnchorSelector = 'div.highlighted section.alert-danger ul li:first-child a:first-child'
      var firstErrorElement = $(firstErrorAnchorSelector).attr('href');
      var formElement = $(firstErrorElement).parent().closest('form');
      var attachToThis = formElement;
      var firstFormItem = $(formElement).find('.form-item').first();
      if ($(firstFormItem).length == 1 && !$(firstFormItem).hasClass('error')) {
        $(highlightedSelector).insertAfter($(firstFormItem));
      }
      else if ($(attachToThis).length == 1) {
        $(highlightedSelector).insertBefore($(attachToThis));
      }
    }
  }
  function setErrorElementsText() {
    if (WxtHelper.wetboewFail == true && WxtHelper.validationType == 'wetboew') {
      return;
    }
    var all = 'form.webform-submission-form .alert-danger';
    if ($('form.webform-submission-form').hasClass('wxt-processed')) {
      // Prevent over-processing.
      return;
    }
    console.log('setErrorElementText');
    $(all).each(function(index, element) {
      if ($(this).length == 1) {
        console.log('index of form alert-danger:' + index);
        var desired = WxtHelper.requiredSuffixFormElement(index);
        if (desired.indexOf($(this).text)) {
          $(this).text(desired);
        }
      }
    });
    // Add wxt-processed class to prevent over-processing.
    $('form.webform-submission-form').addClass('wxt-processed');
    // Now for the section element anchor text.
    var all = 'div.region-highlighted section.alert-danger ul a';
    if ($('div.region-highlighed section.alert-danger').hasClass('wxt-processed')) {
      // Prevent over-processing.
      return;
    }
    $(all).each(function(index, element) {
      if ($(this).length == 1) {
        console.log('index of section alert-danger:' + index);
        var desired = WxtHelper.getErroredMessage(index);
        if (desired.indexOf($(this).text)) {
          $(this).text(desired);
        }
      }
    });
    $('div.region-highlighed section.alert-danger').addClass('wxt-processed');
  }
  function init() {
    // How frequent to check for your object.
    var interval = 35;
    if (WxtHelper.validationType == 'wet-boew') {
      interval = 250;
    }
    WxtHelper.lang = jQuery('html').attr('lang');
    if (WxtHelper.isReady()) {
      if (WxtHelper.validationType == 'drupal') {
        WxtHelper.onReady();
      }
      else {
        // Wetboew is a bit slow to initialize, improve this later.
        var submit = '#edit-actions-submit';
        $(submit).removeAttr('disabled');
        if ($('div.highlighted section.alert-danger').length == 1) {
          WxtHelper.wetboewFail = true;
          setTimeout(function () {
            WxtHelper.beforeReadyOverride();
            WxtHelper.onReady();
          }, 200);
        }
        else {
          setTimeout(function () {
            WxtHelper.onReady();
          }, 200);
        }
      }
    }
    else {
      if (WxtHelper.timeout > 0) {
        WxtHelper.timeout -= interval;
        window.setTimeout(arguments.callee, interval);
      } else {
        console.log("WxtHelper.isReady() timed-out always returning false.");
      }
    }
  }
  function beforeReadyOverride() {
    WxtHelper.validationHelper();
    WxtHelper.setErrorElementsText();
    WxtHelper.moveAlertInsideLabel();
    WxtHelper.makeErrorTitleLikeWetboew(true);
    WxtHelper.moveErrors();
    $('section.alert-danger').removeAttr('role');
    $('section.alert-danger').attr('tabindex', '-1');
    $('section.alert-danger li a').first().trigger('focus');
  }
  function getErroredMessage(index) {
    console.log('getErroredMessage()');
    var erroredText = '';
    if (WxtHelper.erroredElements[index].length) {
      erroredText = WxtHelper.erroredMessages[index];
    }
    return erroredText
  }
  function validationHelper() {
    console.log('validationHelper()');
    var allErrors = jQuery('section.alert-danger ul a').each(function(index) {
      WxtHelper.erroredElements.push($(this).attr('href'));
      var fieldtype = 'unknown';
      if ($($(this).attr('href')).hasClass('field-type-email')) {
        fieldtype = 'form-type-email';
      }
      WxtHelper.erroredMessages.push(WxtHelper.cleanErrorMessage($(this).text(), (index+1)));
    });
    //WxtHelper.erroredElements.forEach(WxtHelper.addErrorToFieldset);
  }
  function validationWetboew() {
    console.log('validationWetboew()');
    if (WxtHelper.validationType == 'wet-boew') {
      $('div.wb-frmvld form fieldset span.label-danger, div.wb-frmvld form > div.has-error span.label-danger').each(function(index) {
        if (!$(this).hasClass('wxt-cleaned')) {
          var prefixSpan = $(this).find('.prefix').prop('outerHTML');
          var prefixText = $(this).find('.prefix').text();
          $(this).find('span.prefix').remove();
          var cleanedText = WxtHelper.cleanErrorMessage(prefixText + $(this).html());
          cleanedText = cleanedText.replace(prefixText, '');
          $(this).html(cleanedText);
          $(this).prepend(prefixSpan);
          $(this).addClass('wxt-cleaned');
        }
      });
    }
  }
  return {
    addErrorToFieldset: addErrorToFieldset,
    beforeReadyOverride: beforeReadyOverride,
    cleanErrorMessage: cleanErrorMessage,
    erroredElements: erroredElements,
    erroredMessages: erroredMessages,
    errorHtml: errorHtml,
    getErroredMessage: getErroredMessage,
    isReady: isReady,
    init: init,
    initialized: initialized,
    lang: lang,
    makeErrorTitleLikeWetboew: makeErrorTitleLikeWetboew,
    moveAlertInsideLabel: moveAlertInsideLabel,
    moveErrors: moveErrors,
    onReady: onReady,
    requiredSuffix: requiredSuffix,
    requiredSuffixFormElement: requiredSuffixFormElement,
    setErrorElementsText: setErrorElementsText,
    timeout: timeout,
    validationHelper: validationHelper,
    validationWetboew: validationWetboew,
    validationType: validationType,
    wetboewFail: wetboewFail,
  }
}();