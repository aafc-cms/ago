/*add this AMD style after i18n so we can use labels.*/
define(["dojo/i18n!ewi/nls/main-ui"], function (i18n) {
    //see end for getter setter functions
    variables = [{
        name: i18n.variableOptionTemp,
        id: "temp",
        indices: [{
            indexTitle: i18n.ffd_warm,
            weeks: ["WK1", "WK2", "WK3", "WK4"],
            index: "ffd_warm",
            season: "growing",
            rasterFunction: "ffd",
            legendRange: i18n.legendRange1Week,
            probabilities: {
                baseIndex: "ffd_warm",
                options: ["_prob"],
                weeks: ["1", "2", "3", "4"],
                rasterFunction: "probability"
            }
        }, {
            indexTitle: i18n.ffd_cool,
            weeks: ["WK1", "WK2", "WK3", "WK4"],
            index: "ffd_cool",
            season: "growing",
            rasterFunction: "ffd",
            legendRange: i18n.legendRange1Week,
            probabilities: {
                baseIndex: "ffd_cool",
                options: ["_prob"],
                weeks: ["1", "2", "3", "4"],
                rasterFunction: "probability"
            }
        }, {
            indexTitle: i18n.dcw_warm,
            weeks: ["WK1", "WK2", "WK3", "WK4"],
            index: "dcw_warm",
            season: "growing",
            rasterFunction: "dcw",
            legendRange: i18n.legendRange1Week,
            probabilities: {
                baseIndex: "dcw_warm",
                options: ["_prob"],
                weeks: ["1", "2", "3", "4"],
                rasterFunction: "probability"
            }
        }, {
            indexTitle: i18n.dcw_cool,
            weeks: ["WK1", "WK2", "WK3", "WK4"],
            index: "dcw_cool",
            season: "growing",
            rasterFunction: "dcw",
            legendRange: i18n.legendRange1Week,
            probabilities: {
                baseIndex: "dcw_cool",
                options: ["_prob"],
                weeks: ["1", "2", "3", "4"],
                rasterFunction: "probability"
            }
        }, {
            indexTitle: i18n.dhw_warm,
            weeks: ["WK1", "WK2", "WK3", "WK4"],
            index: "dhw_warm",
            season: "growing",
            rasterFunction: "dhw",
            legendRange: i18n.legendRange1Week,
            probabilities: {
                baseIndex: "dhw_warm",
                options: ["_prob"],
                weeks: ["1", "2", "3", "4"],
                rasterFunction: "probability"
            }
        }, {
            indexTitle: i18n.dhw_cool,
            weeks: ["WK1", "WK2", "WK3", "WK4"],
            index: "dhw_cool",
            season: "growing",
            rasterFunction: "dhw",
            legendRange: i18n.legendRange1Week,
            probabilities: {
                baseIndex: "dhw_cool",
                options: ["_prob"],
                weeks: ["1", "2", "3", "4"],
                rasterFunction: "probability"
            }
        }, {
            indexTitle: i18n.ifd_grow,
            weeks: ["WK1", "WK2", "WK3", "WK4"],
            index: "ifd_grow",
            season: "growing",
            rasterFunction: "ifd",
            legendRange: i18n.legendRange1Week,
            probabilities: {
                baseIndex: "ifd_grow",
                options: ["_prob"],
                weeks: ["1", "2", "3", "4"],
                rasterFunction: "probability"
            }
        }, {
            indexTitle: i18n.ifd_herb_dorm,
            weeks: ["WK1", "WK2", "WK3", "WK4"],
            index: "ifd_herb_dorm",
            season: "nongrowing",
            rasterFunction: "ifd",
            legendRange: i18n.legendRange1Week,
            probabilities: {
                baseIndex: "ifd_herb_dorm",
                options: ["_prob"],
                weeks: ["1", "2", "3", "4"],
                rasterFunction: "probability"
            }
        }, {
            indexTitle: i18n.ifd_wood_dorm,
            weeks: ["WK1", "WK2", "WK3", "WK4"],
            index: "ifd_wood_dorm",
            season: "nongrowing",
            rasterFunction: "ifd",
            legendRange: i18n.legendRange1Week,
            probabilities: {
                baseIndex: "ifd_wood_dorm",
                options: ["_prob"],
                weeks: ["1", "2", "3", "4"],
                rasterFunction: "probability"
            }
        }, {
            indexTitle: i18n.ifd_herb_nogrow,
            weeks: ["WK1", "WK2", "WK3", "WK4"],
            index: "ifd_herb_nogrow",
            season: "nongrowing",
            rasterFunction: "ifd",
            legendRange: i18n.legendRange1Week,
            probabilities: {
                baseIndex: "ifd_herb_nogrow",
                options: ["_prob"],
                weeks: ["1", "2", "3", "4"],
                rasterFunction: "probability"
            }
        }, {
            indexTitle: i18n.ifd_wood_nogrow,
            weeks: ["WK1", "WK2", "WK3", "WK4"],
            index: "ifd_wood_nogrow",
            season: "nongrowing",
            rasterFunction: "ifd",
            legendRange: i18n.legendRange1Week,
            probabilities: {
                baseIndex: "ifd_wood_nogrow",
                options: ["_prob"],
                weeks: ["1", "2", "3", "4"],
                rasterFunction: "probability"
            }
        }]
    },{
        name: i18n.variableOptionPrecip,
        id: "precip",
        indices: [{
            indexTitle: i18n.pd,
            weeks: ["1d", "2d", "3d", "4d"],
            index: "p",
            season: "all",
            rasterFunction: "pd",
            legendRange: i18n.legendAmountPrecipitation60mm,
            probabilities: {
                baseIndex: "p1d",
                options: ["2_prob", "10_prob", "25_prob"],
                weeks: ["1", "2", "3", "4"],
                rasterFunction: "probability"
            }
        }, {
            indexTitle: i18n.pw,
            index: "p",
            weeks: ["1w", "2w", "3w", "4w"],
            season: "all",
            rasterFunction: "pw",
            legendRange: i18n.legendAmountPrecipitation120mm,
            probabilities: {
                baseIndex: "pweek",
                options: ["25_prob", "50_prob", "100_prob"],
                weeks: ["1", "2", "3", "4"],
                rasterFunction: "probability"
            }
        }, {
            indexTitle: i18n.p10d,
            index: "p10d",
            //weeks: ["2"],  //no weeks for this one.  It's over 2 weeks, but not in data...
            season: "all",
            rasterFunction: "p10d",
            legendRange: i18n.legendAmountPrecipitation20cm,
            probabilities: {
                baseIndex: "p10d",
                options: ["_prob10", "_prob100", "_prob150"],
                //weeks: ["1","2","3","4"],  //no weeks
                rasterFunction: "probability"
            }
        }]
    }, {
        name: i18n.variableOptionHeat,
        id: "heat",
        indices: [
            {
                indexTitle: i18n.egdd_warm,
                index: "egdd_warm",
                //weeks: [],  //no weeks - it's definied period
                season: "growing",
                rasterFunction: "egdd",
                legendRange: i18n.legendRangeEGDD,
                probabilities: {
                    baseIndex: "egdd_warm",
                    options: ["_100prob", "_175prob", "_250prob"],
                    //weeks: [],  //no weeks - it's definied period
                    rasterFunction: "probability"
                }
            },{
                indexTitle: i18n.egdd_cool,
                index: "egdd_cool",
                //weeks: [],  //no weeks - it's definied period
                season: "growing",
                rasterFunction: "egdd",
                legendRange: i18n.legendRangeEGDD,
                probabilities: {
                    baseIndex: "egdd_cool",
                    options: ["_100prob", "_175prob", "_250prob"],
                    //weeks: [],  //no weeks - it's definied period
                    rasterFunction: "probability"
                }
            }
        ]
    }, {
        name: i18n.variableOptionWind,
        id: "wind",
        indices: [
            {
                indexTitle: i18n.drying,
                index: "drying",
                weeks: ["WK1", "WK2", "WK3", "WK4"],
                season: "all",
                rasterFunction: "drying",
                legendRange: i18n.legendRange1Week,
                probabilities: {
                    baseIndex: "drying",
                    options: ["_prob"],
                    weeks: ["1","2","3","4"],
                    rasterFunction: "probability"
                }
            },{
                indexTitle: i18n.mdws,
                index: "mdws",
                weeks: ["1", "2", "3", "4"],
                season: "all",
                rasterFunction: "mdws",
                legendRange: i18n.legendRangeWindSpeed,
                probabilities: {
                    baseIndex: "mdws",
                    options: ["50_prob","70_prob","90_prob"],
                    weeks: ["1","2","3","4"],
                    rasterFunction: "probability"
                }
            },{
                indexTitle: i18n.nswd,
                index: "nswd",
                weeks: ["WK1", "WK2", "WK3", "WK4"],
                season: "all",
                rasterFunction: "nswd",
                legendRange: i18n.legendRange1Week,
                probabilities: {
                    baseIndex: "nswd",
                    options: ["_prob"],
                    weeks: ["1","2","3","4"],
                    rasterFunction: "probability"
                }
            }
        ]
    }]

    return {
        getIndexRef: function(indexId,weekZero) {
            return indexId+weekZero;
        },
        //returns all variables as name and ID as limited array
        getVariablesArray: function() {
            return variables.map(function(v,index,array){
                var rObj = {};
                rObj.id = v.id;
                rObj.name = v.name;
                return rObj;
            });
        },
        //retun whole variable as object
        getVariableObject: function(variableName) {
            var variable = variables.find(function(v) {
                return v.name == variableName || v.id == variableName;
            });
            return variable;
        },

        //get indices as associative array for given variable - might be useless without weeks
        getIndicesArray: function(variableName) {
            var variable = this.getVariableObject(variableName);
            return variable.indices.map(function(element,index,array){
                var rObj = {};
                rObj[element.index] = element.indexTitle;
                return rObj;
            });
        },
        //return entire indices array of objects
        getIndices: function(variableName) {
            var variable = this.getVariableObject(variableName);
            return variable.indices;
        },
        //return whole index object
        getIndex: function(variableName,indexRef) {
            var variable = this.getVariableObject(variableName);
            var index = variable.indices.find(function(element){
                if (element.weeks) {
                    var ref = this.getIndexRef(element.index,element.weeks[0]);
                } else {
                    var ref = element.index;
                }
                return ref == this.indexRef;
            },{indexRef: indexRef,getIndexRef: this.getIndexRef});
            return index;
        },
        getProbabilities: function(variableName,indexId) {
            var index = this.getIndex(variableName,indexId);
            return index.probabilities;
        },
        //return array of probabilities - without weeks, this might be useless
        getProbabilitiesArray: function(variableName,indexId){
            var index = this.getIndex(variableName,indexId);
            return index.probabilities.options.map(function(element,index,array) {
                var rObj = {};
                rObj[element] = i18n[this.indexId+element];
                return rObj;
            },{indexId: indexId});
        },
        //returns season for an index
        getIndexSeason: function(variableName,indexId) {
            var index = this.getIndex(variableName,indexId);
            return index.season;
        },

    }
});