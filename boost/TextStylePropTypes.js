define(function (require, exports, module) {
    "use strict";


    var StyleSheet = require("boost/StyleSheet");
    var LayoutPropTypes = require("boost/LayoutPropTypes");

    var validator = StyleSheet.validator;
    var number = validator.number;
    var string = validator.string;
    var color = validator.color;
    var font = validator.font;
    var _enum = validator.oneOf;

    var TextStylePropTypes = StyleSheet.createPropTypes(LayoutPropTypes /*ViewPropTypes*/ , {
        "color": color,
        //"fontFamily": string,
        "fontFamily": font,
        "fontSize": number,
        "fontStyle": _enum('normal', 'italic'),
        "fontWeight": _enum("normal", 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'),
        "letterSpacing": number,
        "lineHeight": number,
        "textAlign": _enum("auto", 'left', 'right', 'center', 'justify'),
        //"textDecorationColor": string,
        //"textDecorationLine": _enum("none", 'underline', 'line-through', 'underline line-through'),
        //"textDecorationStyle": _enum("solid", 'double', 'dotted', 'dashed'),
        "writingDirection": _enum("auto", 'ltr', 'rtl')
    });

    module.exports = TextStylePropTypes;
});
