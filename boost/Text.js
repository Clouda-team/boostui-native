define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var NativeElement = require("boost/NativeElement");
    var TextStylePropTypes = require("boost/TextStylePropTypes");
    var StyleSheet = require("boost/StyleSheet");
    var validator = require("boost/validator");

    //var NATIVE_VIEW_TYPE = "WrappedTextView";
    var NATIVE_VIEW_TYPE = 1;

    var TextStyle = derive(StyleSheet, TextStylePropTypes);

    var Text = derive(NativeElement, function () {
        //this._super(NATIVE_VIEW_TYPE, "Text");
        NativeElement.call(this, NATIVE_VIEW_TYPE, "Text");
    }, {
        __getStyle: function () {
            return new TextStyle();
        },
        "get value": function () {
            return this.__config__.value || "";
        },
        "set value": function (value) {
            this.__update("value", value);
        },
        "set numberOfLines": function (value) {
            this.__update("numberOfLines", validator.number(value));
        }
    });
    module.exports = Text;
});
