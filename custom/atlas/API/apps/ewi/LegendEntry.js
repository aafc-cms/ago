define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/on",
  "dojo/request/script",
  "dojo/dom-construct",

  "esri/geometry/Extent",
  "esri/SpatialReference"
], function(
  declare,
  lang,
  on,
  script,
  construct,

  Extent,
  SpatialReference
) {

  return declare(null, {

    classForImg: 'legendImage',
    classForText: 'legendText',
    classForEntry: 'legendEntry',

    DEBUG: false,

    constructor: function(div, layer, overrideRasterFunction) {
      this.layer = layer;
      this.containingDiv = div;
      this.layerInfo = null;
      if(overrideRasterFunction) {
        this.overrideRasterFunction = overrideRasterFunction;
      }

      if(layer.loaded) {
        this.getLegendInfoFromLayer();
      } else {
        on(layer, "load", lang.hitch(this, this.getLegendInfoFromLayer));
      }

    },

    getLegendInfoFromLayer: function() {

      var url = this.layer.url + '/legend';
      url += "?f=json";
      var rasterFunction = this.overrideRasterFunction ? this.overrideRasterFunction : this.layer.renderingRule.functionName;
      if(this.layer.renderingRule) {
        var rr = {
          "rasterFunction" : rasterFunction
        };
        url += "&renderingRule=" + dojo.toJson(rr);
      }

      script.get(url, {jsonp:"callback"}).then(lang.hitch(this, function(response) {
        this.layerInfo = response;
        this.updateLegend();
      }));
    },

    updateLegend: function() {
        var arr = this.layerInfo.layers[0].legend;
        var rasterFunction = this.overrideRasterFunction ? this.overrideRasterFunction : this.layer.renderingRule.functionName;
        if (this.DEBUG) {console.log('updating legend: ' + rasterFunction);}
        construct.empty(this.containingDiv);
        for(var i = 0; i < arr.length; i++) {
          this.createEntry(arr[i]);
        }
    },

    createImage: function(legendEntry) {
      var imgSrc = 'data:' + legendEntry.contentType + ';base64,' + legendEntry.imageData;
      return construct.create("img", {src:imgSrc, alt: legendEntry.label, class: this.classForImg} );
    },

    createText: function(legendEntry) {
      return construct.create("span", {class: this.classForText, innerHTML: legendEntry.label + " "});
    },

    createEntry: function(legendEntry) {
      var txt = this.createText(legendEntry);
      var img = this.createImage(legendEntry);
      var entry = construct.create("div", {class: this.classForEntry});
      construct.place(img,entry,"last");
      construct.place(txt,entry,"last");
      construct.place(entry,this.containingDiv,"last");

    }


  });


});
