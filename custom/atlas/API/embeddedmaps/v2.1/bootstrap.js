(function() {

  function getPathToBootstrap() {
    var scriptTag = getEmbeddedScriptTag();
    var url = scriptTag.src.match(/(.+)bootstrap\.js/)[1];
    return url;
  }

  function getEmbeddedScriptTag() {
    return document.querySelector('script[data-emb-bootstrap]');
  }

  function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.async = false;
    if(callback) {
      script.onload = callback;
    }
    document.head.appendChild(script);
  };

  function loadStyle(url) {
    var link = document.createElement("link");
    link.href = url;
    link.type = "text/css";
    link.rel = "stylesheet";
    link.media = "screen,print";
    document.head.appendChild(link);
  };

  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  function getLang() {
    // first, pull lang from doctype
    var lang = document.documentElement.lang;
    // second, check to see if querystring overrides it
    lang = getUrlParameter('lang') ? getUrlParameter('lang') : lang;
    // finally, if it's still unset default to english
    // note that "" == false in Javascript, so this works
    lang = lang ? lang : 'en';
    return lang;
  }

  /* enable debug mode by including debug in the querystring */
  function isDebugMode() {
    if(getUrlParameter('debug'))
      return true;
    else
      return false;
  }

  /* langStrings = map of key-value pairs for i18n string replacement */
  function i18nify(langStrings) {
    var translatableNodes = document.querySelectorAll("[data-i18n]");
    for(var i = 0; i < translatableNodes.length; i++) {
      translatableNodes[i].textContent = langStrings[translatableNodes[i].getAttribute("data-i18n")];
    }
  }

  var esriVersion = "3.21";

  if(!window.dojoConfig) {
    window.dojoConfig = {};
  }

  window.dojoConfig.locale =  getLang();
  window.dojoConfig.parseOnLoad = false;



  loadStyle('//js.arcgis.com/' + esriVersion + '/esri/css/esri.css');
  loadStyle('//js.arcgis.com/' + esriVersion + '/dijit/themes/claro/claro.css');
  var csspath = getPathToBootstrap() + (isDebugMode() ? 'css/' : '') + 'embeddedmaps.css';
  loadStyle(csspath);

  function onArcgisJsapiLoaded() {
    if(typeof window.afterJavascriptApiLoaded === 'function') {
      window.afterEsriJsApiLoaded();
    }

    require([getPathToBootstrap() + 'embeddedmaps.js'], function(EmbeddedMaps) {
      window.emb = new EmbeddedMaps();
      document.body.classList.add('claro');
      if(typeof window.afterEmbeddedMapsLoaded === 'function') {
        window.afterEmbeddedMapsLoaded();
      }
    });
  }

  // Note that 'addOnLoad' above executes after the following script finishes loading
  loadScript('//js.arcgis.com/' + esriVersion + '/init.js', onArcgisJsapiLoaded);

  // Export some useful functions
  if(!window.agr)
    window.agr = {}
  window.agr.loadScript = loadScript;
  window.agr.loadStyle = loadStyle;
  window.agr.getUrlParameter = getUrlParameter;
  window.agr.getLang = getLang;
  window.agr.i18nify = i18nify;


})();
