define(function (require, exports, module) {
    "use strict";


    var StyleSheet = require("boost/StyleSheet");
    var LayoutPropTypes = require("boost/LayoutPropTypes");

    var validator = StyleSheet.validator;
    var number = validator.number;
    var string = validator.string;
    var color = validator.color;
    var _enum = validator.oneOf;

    var ViewStylePropTypes = StyleSheet.createPropTypes(LayoutPropTypes, {
        "backgroundColor": color, //
        "borderRadius": number, //
        "borderTopLeftRadius": number, //
        "borderTopRightRadius": number, //
        "borderBottomRightRadius": number, //
        "borderBottomLeftRadius": number, //
        "borderColor": color, //
        "borderLeftColor": color, //
        "borderTopColor": color, //
        "borderRightColor": color, //
        "borderBottomColor": color, //
        "opacity": number, //
        "overflow": _enum('visible', 'hidden'), //
        //"shadowColor": color, //
        //"shadowOffset": { //
        //    "width": number,
        //    "height": number
        //},
        //"shadowOpacity": number, //
        //"shadowRadius": number, //}
    });

    module.exports = ViewStylePropTypes;

});
