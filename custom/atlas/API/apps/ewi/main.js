define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/on",
  "dojo/dom",
  "dojo/query",
  "dojo/Deferred",
  "esri/geometry/Extent",
  "esri/SpatialReference",
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/layers/ArcGISImageServiceLayer",
  "ewi/LegendEntry",
  "dojo/i18n!ewi/nls/main-ui",
  "ewi/variables"
], function(
  declare,
  lang,
  on,
  dom,
  query,
  Deferred,
  Extent,
  SpatialReference,
  ArcGISDynamicMapServiceLayer,
  ArcGISImageServiceLayer,
  LegendEntry,
  i18n,
  ewiVariables
) {

  var DEBUG = false;

  return declare(null, {

    season: "all",
    initialVariable: "temp",
    //months are zero-indexed.  April is 3
    growing: [3,4,5,6,7,8,9],
    dormant: [0,1],
    nonGrowing: [0,1,2,10,11,12],

    locale: window.agr.getLang(),
    localeStringForRasterFunction: "",
    twoCharacterRegionStrings: {
      "national" : "nl",
      "atlantic" : "at",
      "bc" : "bc",
      "onqc" : "ce",
      "prairies" : "pr"
    },

    extents: {
      max: null,
      national: new Extent(-18660056, 4938274, -2262174, 12608882, new SpatialReference(102100)),
      bc: new Extent(-16539387.930867104, 6254213.91891825, -11182680.988643376, 8211001.843018241, new SpatialReference(102100)),
      prairies: new Extent(-14112970.904983114, 6322701.496261749, -8756263.962759387, 8279489.4203617405, new SpatialReference(102100)),
      atlantic: new Extent(-8966618.664600138, 5388335.262504004, -3609911.722376409, 7345123.186603995, new SpatialReference(102100)),
      onqc: new Extent(-11290304.324468877, 5584014.054914003, -5933597.382245149, 7540801.979013994, new SpatialReference(102100))
    },

    ewi_services: [
      {
        name: "temp",
        url: "/atlas/rest/services/imageservices/ewi_temperature/ImageServer/",
        spatialReference: "102100",
        visible: true
      },{
        name: "precip",
        url: "/atlas/rest/services/imageservices/ewi_precipitation/ImageServer/",
        spatialReference: "102100",
        visible: false
      },{
        name: "heat",
        url: "/atlas/rest/services/imageservices/ewi_heat/ImageServer/",
        spatialReference: "102100",
        visible: false
      },{
        name: "wind",
        url: "/atlas/rest/services/imageservices/ewi_wind/ImageServer/",
        spatialReference: "102100",
        visible: false
      }
    ],

    agExtent_service: "/atlas/rest/services/app_agrimap_agricarte/agrimap_canada_agricultural_extent_slc/MapServer",

    constructor: function(maps, dropdowns) {

      this.showLoading();

      this.maps = maps;
      this.dropdowns = dropdowns;

      this.season = this.getSeason();

      this.loadSelectVariables(dropdowns.variable);

      this.ewi_services.forEach(function(variable) {
        var layer = new ArcGISImageServiceLayer(variable.url,
          {
            id: "ewi_"+variable.name,
            spatialReference: variable.spatialReference,
            visible: variable.visible,
            opacity: 0.7
          }
        );
        var probLayer = new ArcGISImageServiceLayer(variable.url,
          {
            id: "ewi_"+variable.name+"_probability",
            spatialReference: variable.spatialReference,
            visible: variable.visible,
            opacity: 0.7
          }
        );
        this.maps[0].addLayer(layer);
        this.maps[1].addLayer(probLayer);

      }, this);

      this.indexLayer = this.maps[0].getLayer("ewi_"+this.initialVariable);
      this.probLayer = this.maps[1].getLayer("ewi_"+this.initialVariable+"_probability");

      this.localeStringForRasterFunction = this.locale === "fr" ? '_f' : '_e';

      // Add additional layers
      var agExtent1 = new ArcGISDynamicMapServiceLayer(
        this.agExtent_service,
        {id:"agExtent1"}
      );
      var agExtent2 = new ArcGISDynamicMapServiceLayer(
        this.agExtent_service,
        {id:"agExtent2"}
      );

      this.maps[0].addLayer(agExtent1);
      this.maps[1].addLayer(agExtent2);


      this.i18nify(); //takes care of existing controls

      on(this.dropdowns.variable, 'change',  lang.hitch(this,this.loadSelectIndices));
      on(this.dropdowns.variable, 'change',  lang.hitch(this,this.updateServiceLayers));

      on(this.dropdowns.region, 'change', lang.hitch(this, this.updateRegion));

      on(this.dropdowns.forecastperiod, 'change', lang.hitch(this, this.updateDateRange));

      on(this.dropdowns.index, 'change',  lang.hitch(this,this.loadSelectProbabilities));
      on(this.dropdowns.index, 'change', lang.hitch(this, this.updateDateRange));

      // set up the loading mask.  Since maps move in sync, only need to set it on one map
      this.maps[0].on('update-start', this.showLoading);
      this.maps[0].on('update-end', this.hideLoading);

      for (var dropdown in this.dropdowns) {
        // Don't update raster if they just pan the map
        if (dropdown !== "region") {
          on(this.dropdowns[dropdown], 'change', lang.hitch(this, this.updateSelectedRaster));
        }
        // Update the legend descriptions on any dropdown list change
        // Might be able to get by with only watching variable, but this is a tiny operation
        on(this.dropdowns[dropdown], 'change', lang.hitch(this, this.updateLegendDescription));

        // Update map title's on any dropdown list change
        on(this.dropdowns[dropdown], 'change', lang.hitch(this, this.updateMapTitles));

        // Update download links on any dropdown list change
        on(this.dropdowns[dropdown], 'change', lang.hitch(this, this.updateDownloadLink));
      }

      // Set up map loaded event (only scanning first map for now - might need to check both in future)
      if(this.maps[0].loaded) {
        this.onMapLoaded();
      } else {
        this.maps[0].on('load', lang.hitch(this, function() {this.onMapLoaded()}));
      }

      // Fire all the updates on initial load
      this.updateSelectedRaster();
      this.updateRegion();
      this.updateMapTitles();
      this.updateDownloadLink();
      this.updateLegendDescription();
      // Have to delay this one until the layer is finished loading
      if(this.indexLayer.loaded){
        this.updateDateRange();
      }
      else{
        on.once(this.indexLayer, 'load', lang.hitch(this, this.updateDateRange));
      }

    },

    inSeason: function(checkSeason) {
      if (checkSeason === this.season || checkSeason === "all") {
        return true;
      } else {
        return false;
      }
    },

    getSeason: function() {
      var today = new Date();
      var month = today.getMonth();
      if (this.growing.indexOf(month) >= 0) {
        return "growing";
      } else if (this.nonGrowing.indexOf(month)>=0) {
        return "nongrowing";
      }
    },

    //IE doesn't automatically do this, so it's been added explicitly
    selectFirstEnabledOption: function(element) {
      for (var i = 0; i < element.options.length; i++) {
        if (element.options[i].disabled != true) {
          element.options[i].selected = true;

          var event;
          if(typeof(Event) === 'function') {
              event = new Event('change');
          }else{
              event = document.createEvent('Event');
              event.initEvent('change', true, true);
          }
          element.dispatchEvent(event);

          return;
        }
      }
    },

    loadSelectVariables: function(dropdown) {
      if (DEBUG) { console.log("loadSelectVariables") };
      var variables = ewiVariables.getVariablesArray();

      variables.forEach(function(variable,index,array) {
        var indices = ewiVariables.getIndices(variable.name);
        var isSeason = indices.filter(function (element) {
          return this.inSeason(element.season);
        },this);

        var selectOption = document.createElement("option");
        selectOption.text = variable.name;
        selectOption.value = variable.id;
        if (isSeason.length <= 0) {
          selectOption.disabled = true;
        }
        this.dropdown.add(selectOption);
      },{dropdown: dropdown, inSeason: this.inSeason, season: this.season});

      this.selectFirstEnabledOption(dropdown);
      this.loadSelectIndices();

    },

    loadSelectIndices: function() {
      if (DEBUG) { console.log("loadSelectIndices") };

      this.dropdowns.forecastperiod.selectedIndex = 0;
      this.removeOptions(this.dropdowns.index);

      var indices = ewiVariables.getIndices(this.dropdowns.variable.value);

      indices.forEach(function(index) {
        var selectOption = document.createElement("option");
        selectOption.text = index.indexTitle;
        selectOption.value = index.index;

        selectOption.dataset.legendRange = index.legendRange;
        if (index.weeks) {
          selectOption.dataset.weeks = index.weeks;
          selectOption.dataset.refid = index.index+index.weeks[0];
        } else {
          selectOption.dataset.weeks = "";
          selectOption.dataset.refid = index.index
        }
        selectOption.dataset.rf = index.rasterFunction;
        if (index.season != "all" && index.season != this.season) {
          selectOption.disabled = true;
        }
        this.dropdowns.index.add(selectOption);
      },this);

      this.selectFirstEnabledOption(this.dropdowns.index);
      this.loadSelectProbabilities();

    },

    loadSelectProbabilities: function() {
      if (DEBUG) { console.log("loadSelectProbabilities") };
      this.removeOptions(this.dropdowns.probability);

      if (this.dropdowns.index.selectedIndex < 0) {
        this.dropdowns.probability.disabled = true;
        return false;
      }
      this.dropdowns.probability.disabled = false;

      var indexRef = this.dropdowns.index.options[this.dropdowns.index.selectedIndex].dataset.refid;

      var indexSeason = ewiVariables.getIndexSeason(this.dropdowns.variable.value,indexRef);
      if (this.inSeason(indexSeason)) {
        var probabilities = ewiVariables.getProbabilities(this.dropdowns.variable.value,indexRef);

        var baseIndex = probabilities.baseIndex;
        var probWeeks = probabilities.weeks;

        if (probabilities.weeks) {
          probWeeks = probabilities.weeks;
        } else {
          probWeeks = [];
        }

        probabilities.options.forEach(function(prob){

          var selectOption = document.createElement("option");
          selectOption.text = i18n[this.baseIndex+prob];
          selectOption.value = this.baseIndex+prob;

          selectOption.dataset.rf = this.rasterFunction;
          selectOption.dataset.weeks = JSON.stringify(this.probWeeks);

          this.dropdowns.probability.add(selectOption);

        },{dropdowns: this.dropdowns,baseIndex: baseIndex,probWeeks: probWeeks, rasterFunction:"probability"});

      }
      this.selectFirstEnabledOption(this.dropdowns.probability);
      this.loadSelectWeeks();
    },
    loadSelectWeeks: function() {
      if (DEBUG) { console.log("loadSelectWeeks") };

      this.removeOptions(this.dropdowns.forecastperiod);

      var indexRef = this.dropdowns.index.options[this.dropdowns.index.selectedIndex].dataset.refid;
      var index = ewiVariables.getIndex(this.dropdowns.variable.value,indexRef);
      var weeks = index.weeks;

      if (weeks && weeks.length > 0) {
        weeks.forEach(function(week,index,array) {
          var selectOption = document.createElement("option");
          selectOption.text = i18n["forecastPeriodOptionWeek"+(index+1)];
          selectOption.value = week;
          this.dropdowns.forecastperiod.add(selectOption);
        },{dropdowns: this.dropdowns});
      } else {
        var selectOption = document.createElement("option");
        selectOption.text = i18n["forecastPeriod2Weeks"];
        selectOption.value = "";  //will be automating these strings, want it empty
        this.dropdowns.forecastperiod.add(selectOption);
      }
      this.selectFirstEnabledOption(this.dropdowns.forecastperiod);
    },

    //in case format changes
    getLayerFilter: function() {
      var index = this.dropdowns.index.value;
      var week = this.dropdowns.forecastperiod.value;
      return index+week;
    },

    getProbabilityFilter: function() {
      if (DEBUG) { console.log("getProbabilityFilter") };

      var probIndex = this.dropdowns.probability.selectedIndex;
      var weekIndex = this.dropdowns.forecastperiod.selectedIndex;
      var weeks = [];

      if (this.dropdowns.probability.options[probIndex].dataset && this.dropdowns.probability.options[probIndex].dataset["weeks"])  {
        weeks = JSON.parse(this.dropdowns.probability.options[probIndex].dataset["weeks"]);
      }

      if (weeks.length > 0) {
        var week = weeks[weekIndex];
      } else {
        var week = "";
      }

      var probability = this.dropdowns.probability.value;
      return probability+week;
    },

    removeOptions: function(selectbox)
    {
        var i;
        for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
        {
            selectbox.remove(i);
        }
    },

    updateServiceLayers: function() {
      if (DEBUG) { console.log("updateServiceLayers") };

      var toplayerId = "ewi_"+this.dropdowns.variable.value;
      var probLayerId = "ewi_"+this.dropdowns.variable.value+"_probability";

      //loop through all layers in each map and turn them off.  turn on only the ones we need//except other layers
      this.ewi_services.forEach(function(variable) {
        var layerId = "ewi_"+variable.name;
        var indexLyr = this.maps[0].getLayer(layerId);
        var probLyr = this.maps[1].getLayer(layerId+"_probability");
        if (indexLyr.id === this.toplayerId) {
          indexLyr.show();
        } else {
          indexLyr.hide();
        }
        if (probLyr.id === this.probLayerId) {
          probLyr.show();
        } else {
          probLyr.hide();
        }
      },{maps: this.maps,toplayerId:toplayerId,probLayerId:probLayerId});

      this.indexLayer = this.maps[0].getLayer(toplayerId);
      this.probLayer = this.maps[1].getLayer(probLayerId);

    },

    onMapLoaded: function() {
      this.extents.max = this.maps[0].extent;
    },

    updateSelectedRaster: function() {
      if (DEBUG) { console.log("updateSelectedRaster") };

      var rasterNames = this.createRasterNamesFromDropdowns();

      var mrObj = {
        "method": esri.layers.MosaicRule.METHOD_CENTER,
        "ascending": true,
        "operation": esri.layers.MosaicRule.OPERATION_FIRST
      }

      mrObj.where = "tType='" + rasterNames.time + "'";
      var mr = new esri.layers.MosaicRule(mrObj);

      var rf = new esri.layers.RasterFunction();
      rf.functionName = this.dropdowns.index.options[this.dropdowns.index.selectedIndex].dataset.rf + this.localeStringForRasterFunction;

      this.indexLayer.setMosaicRule(mr);
      this.indexLayer.setRenderingRule(rf);

      var legend1 = dom.byId('map1Legend');
      var leg1 = new LegendEntry(legend1, this.indexLayer);


      mrObj.where = "tType='" + rasterNames.prob + "'";
      mr = new esri.layers.MosaicRule(mrObj);

      rf = new esri.layers.RasterFunction();
      rf.functionName = this.dropdowns.probability.options[this.dropdowns.probability.selectedIndex].dataset.rf + this.localeStringForRasterFunction;

      this.probLayer.setMosaicRule(mr);
      this.probLayer.setRenderingRule(rf);

      var legend2 = dom.byId('map2Legend');
      var leg2 = new LegendEntry(legend2, this.probLayer);
    },

    updateMapTitles: function() {
      var map1Title = dom.byId('map1Title');
      var map2Title = dom.byId('map2Title');

      var indexTitle = this.dropdowns.index.options[this.dropdowns.index.selectedIndex].text;
      var probTitle = this.dropdowns.probability.options[this.dropdowns.probability.selectedIndex].text;

      if (this.locale == "fr") {
        probTitle = this.firstLowerCase(probTitle);
        if (["a","e","i","o","u"].indexOf(probTitle[0]) > 0) {
          probTitle = i18n["probabilityTitlePrefixApos"] + probTitle;
        } else {
          probTitle = i18n["probabilityTitlePrefix"] + probTitle;
        }
      } else {
        probTitle = i18n["probabilityTitlePrefix"] + probTitle;
      }

      map1Title.innerHTML = indexTitle;
      map2Title.innerHTML = probTitle;

    },

    firstLowerCase: function(string)
    {
        return string.charAt(0).toLowerCase() + string.slice(1);
    },

    updateDateRange: function() {
      if (DEBUG) { console.log("updateDate");}
      this.asyncGetLayerTime().then(lang.hitch(this, function(timeExtents) {
        var dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

        if(!timeExtents) {
          if (DEBUG) { console.log("Couldn't get time information for index layer.  Is it enabled?") };
        }

        var initialTimeLabel = dom.byId('initialDate');
        var dateRangeLabel = dom.byId('dateRange');

        //if value = "" then it's 2 weeks
        var weekInt = this.dropdowns.forecastperiod.value === "" ? -1 : this.dropdowns.forecastperiod.selectedIndex;

        var dateRangeStart = weekInt > 1 ? new Date(timeExtents.startTime) : new Date(timeExtents.endTime);
        var initialDate = weekInt > 1 ? new Date(timeExtents.startTime) : new Date(timeExtents.endTime);

        if (weekInt < 0) {
          dateRangeStart.setDate(dateRangeStart.getDate()+0);
          var dateRangeEnd = new Date(dateRangeStart);
          dateRangeEnd.setDate(dateRangeStart.getDate() + 13);
        } else {
          dateRangeStart.setDate(dateRangeStart.getDate() + 7*weekInt); // start X weeks in the future (week1 = 0, week2 = 1, etc)
          var dateRangeEnd = new Date(dateRangeStart);
          dateRangeEnd.setDate(dateRangeStart.getDate() + 6); // +6 because it's inclusive (ie June 1st to June 7th)
        }

        // if we are on week 1 or 2, use the 'end time'.  If we are on week 3
        // or week 4, we roll back to the closest thursday.  Brad does this
        // for us and stores it in startTime.  endTime is the current time

        initialTimeLabel.innerHTML = initialDate.toLocaleDateString(this.locale, dateOptions);
        dateRangeLabel.innerHTML = dateRangeStart.toLocaleDateString(this.locale, dateOptions) + i18n["dailyForecastDateSeparator"] + dateRangeEnd.toLocaleDateString(this.locale, dateOptions);

      }));
    },

    createRasterNamesFromDropdowns: function() {
      var rasterNameTime = this.getLayerFilter();
      var rasterNameProb = this.getProbabilityFilter();

      if (DEBUG) { console.log('rasterNames: ' + rasterNameTime + ' ' + rasterNameProb) };

      return {
        time: rasterNameTime,
        prob: rasterNameProb
      };
    },

    updateRegion: function() {
      var region = this.dropdowns.region.value;
      this.maps[0].setExtent(this.extents[region]);
      this.maps[1].setExtent(this.extents[region]);
    },

    updateDownloadLink: function() {
      var dlIndexAnchors = [dom.byId('downloadLinkIndex')];
      var dlProbAnchors = [dom.byId('downloadLinkProb')];

      var regionValue = this.dropdowns.region.value;
      // Capitalize the first character.  i18n has it capitalized
      var regionString = this.convertUnderscoresToCamelCase(regionValue);


      var indexString = i18n["downloadIndex" + regionString];
      var probString = i18n["downloadProb" + regionString];

      indexString += " ( " + i18n["downloadFormat"] + ", " + i18n["downloadSize"] + " )";
      probString += " ( " + i18n["downloadFormat"] + ", " + i18n["downloadSize"] + " )";

      var urls = this.generateDownloadLink(this.dropdowns.region.value, this.dropdowns.variable.value);

      for(var i = 0; i < dlIndexAnchors.length; i++) {
        dlIndexAnchors[i].setAttribute("href", urls.indexUrl);
        dlIndexAnchors[i].textContent = indexString;
        dlProbAnchors[i].setAttribute("href", urls.probUrl);
        dlProbAnchors[i].textContent = probString;
      }
    },

    updateLegendDescription: function(evt) {
      var indexDesc = dom.byId('indexLegendDescription');
      var probDesc = dom.byId('probabilityLegendDescription');
      var variable = this.dropdowns.variable.value;
      // capitalize the first letter to match the language string lookup
      variable = variable.charAt(0).toUpperCase() + variable.slice(1);

      var indexLegendRange = this.dropdowns.index.options[this.dropdowns.index.selectedIndex].dataset["legendRange"];

      var indexTitle = this.dropdowns.index.options[this.dropdowns.index.selectedIndex].text;
      var probabilityTitle = this.dropdowns.probability.options[this.dropdowns.probability.selectedIndex].text;

      var indexString = i18n["legendIndexDescription"];
      indexString = indexString.replace("${content}", indexTitle);
      indexString = indexString.replace("${range}", indexLegendRange);
      var probString = i18n["legendProbabilityDescription"];
      probString = probString.replace("${probability}", probabilityTitle);

      indexDesc.textContent = indexString;
      probDesc.textContent = probString;

    },

    showLoading: function() {
      query('.loadingMaskContainer').forEach(function(node) {
        node.removeAttribute('hidden');
      });
      if (DEBUG) { console.log("loading mask enabled") };
    },

    hideLoading: function() {
      query('.loadingMaskContainer').forEach(function(node) {
        node.setAttribute('hidden', '');
      });
      if (DEBUG) { console.log("loading mask disabled") };
    },

    asyncGetLayerTime: function() {
      var deferred = new Deferred();
      if (this.indexLayer.loaded) {
        deferred.resolve(this.indexLayer.timeInfo.timeExtent);
      } else {
        layer.on('load', function(evt) {
          deferred.resolve(evt.layer.timeInfo.timeExtent);
        });
      }
      return deferred;
    },

    getDigitFromForecastPeriod: function() {
      return this.dropdowns. forecastperiod.value.match(/[0-9]/)[0];
    },

    /* current URL structure looks something like this:
       /atlas/data_donnees/cli/extremeWeatherIndices/maps_cartes/en/temperature/at_ifd_herb_dorm_prob2_e.pdf
       So .../maps_cartes/LANGUAGE/VARIABLE/REGION_INDEX_(WK/prob)WEEKNUM_LANG.pdf
    */
    generateDownloadLink: function(region,variable) {

      var rf = this.dropdowns.index.options[this.dropdowns.index.selectedIndex].dataset.rf;

      var url = [
        "/atlas/data_donnees/cli/extremeWeatherIndices/maps_cartes/",
        this.locale,
        "/",
        i18n[variable],
        "/",
        rf,
        "/",
        this.twoCharacterRegionStrings[region],
        "_",
        "${indexOrProbability}",
        "_",
        this.locale.charAt(0),
        ".pdf"
      ].join('');

      var indexUrl = url.replace("${indexOrProbability}", this.getLayerFilter());
      var probUrl = url.replace("${indexOrProbability}", this.getProbabilityFilter());

      return {indexUrl: indexUrl, probUrl: probUrl};

    },

    i18nify: function() {
      var translatableNodes = query("[data-i18n]");
      for(var i = 0; i < translatableNodes.length; i++) {
        translatableNodes[i].textContent = i18n[translatableNodes[i].getAttribute("data-i18n")];
      }

    },

    convertUnderscoresToCamelCase: function(input) {
      var output = "";
      var arr = input.split("_");
      for(var i = 0; i < arr.length; i++) {
        output += arr[i].charAt(0).toUpperCase();
        output += arr[i].substring(1);
      }
      return output;
    }



  });


});
