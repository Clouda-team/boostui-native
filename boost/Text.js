define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var NativeElement = require("boost/NativeElement");
    var TextStylePropTypes = require("boost/TextStylePropTypes");
    var StyleSheet = require("boost/StyleSheet");

    var NATIVE_VIEW_TYPE = "WrappedTextView";

    var TextStyle = derive(StyleSheet, TextStylePropTypes);

    var Text = derive(NativeElement, function () {
        this._super(NATIVE_VIEW_TYPE, "Text");
    }, {
        __getStyle: function () {
            return new TextStyle();
        },
        "get value": function () {
            return this.__config__.value || "";
        },
        "set value": function (value) {
            this.__update("value", value);
        }
    });
    module.exports = Text;
});
