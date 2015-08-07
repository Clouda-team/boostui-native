define(function (require, exports, module) {
    "use strict";


    var StyleSheet = require("boost/StyleSheet");
    var LayoutPropTypes = require("boost/LayoutPropTypes");
    var validator = require("boost/validator");

    var number = validator.number;
    var dp = validator.dp;
    var string = validator.string;
    var color = validator.color;
    var _enum = validator.oneOf;

    var ViewStylePropTypes = StyleSheet.createPropTypes(LayoutPropTypes, {
        "backgroundColor": color, //
        "borderRadius": dp, //
        "borderTopLeftRadius": dp, //
        "borderTopRightRadius": dp, //
        "borderBottomRightRadius": dp, //
        "borderBottomLeftRadius": dp, //
        "borderColor": color, //
        "borderLeftColor": color, //
        "borderTopColor": color, //
        "borderRightColor": color, //
        "borderBottomColor": color, //
        "opacity": number, //
        "overflow": _enum('visible', 'hidden'), //
        //"shadowColor": color, //
        //"shadowOffset": { //
        //    "width": dp,
        //    "height": dp
        //},
        //"shadowOpacity": number, //
        //"shadowRadius": dp, //}
    });

    module.exports = ViewStylePropTypes;

});
