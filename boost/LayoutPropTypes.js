define(function (require, exports, module) {
    "use strict";

    var StyleSheet = require("boost/StyleSheet");
    var validator = require("boost/validator");

    var number = validator.number;
    var dp = validator.dp;
    var _enum = validator.oneOf;

    var UNDEFINED = "UNDEFINED";
    var LayoutPropTypes = StyleSheet.createPropTypes({
        "width": [dp, UNDEFINED],
        "height": [dp, UNDEFINED],
        "left": [dp, UNDEFINED],
        "right": [dp, UNDEFINED],
        "top": [dp, UNDEFINED],
        "bottom": [dp, UNDEFINED],
        "margin": [dp, 0],
        "marginLeft": [dp, 0],
        "marginRight": [dp, 0],
        "marginTop": [dp, 0],
        "marginBottom": [dp, 0],
        "marginHorizontal": [dp, 0],
        "marginVertical": [dp, 0],
        "padding": [dp, 0],
        "paddingLeft": [dp, 0],
        "paddingRight": [dp, 0],
        "paddingTop": [dp, 0],
        "paddingBottom": [dp, 0],
        "paddingHorizontal": [dp, 0],
        "paddingVertical": [dp, 0],
        "borderWidth": [dp, 0],
        "borderLeftWidth": [dp, 0],
        "borderRightWidth": [dp, 0],
        "borderTopWidth": [dp, 0],
        "borderBottomWidth": [dp, 0],
        "flexDirection": [_enum("row", "column"), "column"],
        "justifyContent": [_enum("flex-start", "flex-end", "center", "space-between", "space-around"), "flex-start"],
        "alignItems": [_enum("flex-start", "flex-end", "center", "stretch"), "stretch"],
        "alignSelf": [_enum("auto", "flex-start", "flex-end", "center", "stretch"), "auto"],
        "flex": [number, 1],
        "flexWrap": [_enum("wrap", "nowrap"), "nowrap"],
        "position": [_enum("absolute", "relative"), "relative"],
    });

    module.exports = LayoutPropTypes;

});
