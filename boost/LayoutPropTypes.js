define(function (require, exports, module) {"use strict";

var StyleSheet = require("boost/StyleSheet");

var validator = StyleSheet.validator;
var number = validator.number;
var _enum = validator.oneOf;

var LayoutPropTypes = StyleSheet.createPropTypes({
    "width": number, //
    "height": number, //
    "left": number, //
    "right": number, //
    "top": number, //
    "bottom": number, //
    "margin": number, //
    "marginLeft": number, //
    "marginRight": number, //
    "marginTop": number, //
    "marginBottom": number, //
    "marginHorizontal": number, //
    "marginVertical": number, //
    "padding": number, //
    "paddingLeft": number, //
    "paddingRight": number, //
    "paddingTop": number, //
    "paddingBottom": number, //
    "paddingHorizontal": number, //
    "paddingVertical": number, //
    "borderWidth": number, //
    "borderLeftWidth": number, //
    "borderRightWidth": number, //
    "borderTopWidth": number, //
    "borderBottomWidth": number, //
    "flexDirection": _enum("row", "column"), //
    "justifyContent": _enum("flex-start", "flex-end", "center", "space-between", "space-around"), //
    "alignItems": _enum("flex-start", "flex-end", "center", "stretch"), //
    "alignSelf": _enum("auto", "flex-start", "flex-end", "center", "stretch"), //
    "flex": number, //
    "flexWrap": _enum("wrap", "nowrap"), //
    "position": _enum("absolute", "relative"), //
});

module.exports = LayoutPropTypes;

});
