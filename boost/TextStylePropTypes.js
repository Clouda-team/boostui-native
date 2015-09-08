define(function (require, exports, module) {
    "use strict";


    var StyleSheet = require("boost/StyleSheet");
    var LayoutPropTypes = require("boost/LayoutPropTypes");
    var validator = require("boost/validator");

    var number = validator.number;
    var dp = validator.dp;
    var string = validator.string;
    var color = validator.color;
    var font = validator.font;
    var _enum = validator.oneOf;

    var TextStylePropTypes = StyleSheet.createPropTypes(LayoutPropTypes, {
        "color": [color, "black"],
        //"fontFamily": string,
        "backgroundColor": [color, "transparent"],
        "fontFamily": [font, "sans-serif"],
        "fontSize": [number, 14],
        "fontStyle": [_enum('normal', 'italic'), "normal"],
        "fontWeight": [_enum("normal", 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'), "normal"],
        "letterSpacing": [number, null], //TODO: 未在native代码中找到相应属性
        "lineHeight": [dp, 0], //TODO: ok?
        "textAlign": [_enum("auto", 'left', 'right', 'center', 'justify'), "auto"],
        //"textDecorationColor": [string, "black"],
        //"textDecorationLine": [_enum("none", 'underline', 'line-through', 'underline line-through'), "none"],
        //"textDecorationStyle": [_enum("solid", 'double', 'dotted', 'dashed'), "solid"],
        "writingDirection": [_enum("auto", 'ltr', 'rtl'), "ltr"],
        "textDecoration": [_enum("none", "underline", "line-through"), "none"]
    });

    module.exports = TextStylePropTypes;
});
