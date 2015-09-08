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
        "backgroundColor": [color, "transparent"],
        "borderRadius": [dp, 0],
        "borderTopLeftRadius": [dp, 0],
        "borderTopRightRadius": [dp, 0],
        "borderBottomRightRadius": [dp, 0],
        "borderBottomLeftRadius": [dp, 0],
        "borderColor": [color, "black"],
        "borderLeftColor": [color, "black"],
        "borderTopColor": [color, "black"],
        "borderRightColor": [color, "black"],
        "borderBottomColor": [color, "black"],
        "opacity": [number, 1],
        "overflow": [_enum('visible', 'hidden'), 'hidden'],
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
