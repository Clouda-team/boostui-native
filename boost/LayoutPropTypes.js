define(function (require, exports, module) {
    "use strict";

    var StyleSheet = require("boost/StyleSheet");

    var validator = StyleSheet.validator;
    var number = validator.number;
    var dp = validator.dp;
    var _enum = validator.oneOf;

    var LayoutPropTypes = StyleSheet.createPropTypes({
        "width": dp, //
        "height": dp, //
        "left": dp, //
        "right": dp, //
        "top": dp, //
        "bottom": dp, //
        "margin": dp, //
        "marginLeft": dp, //
        "marginRight": dp, //
        "marginTop": dp, //
        "marginBottom": dp, //
        "marginHorizontal": dp, //
        "marginVertical": dp, //
        "padding": dp, //
        "paddingLeft": dp, //
        "paddingRight": dp, //
        "paddingTop": dp, //
        "paddingBottom": dp, //
        "paddingHorizontal": dp, //
        "paddingVertical": dp, //
        "borderWidth": dp, //
        "borderLeftWidth": dp, //
        "borderRightWidth": dp, //
        "borderTopWidth": dp, //
        "borderBottomWidth": dp, //
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
