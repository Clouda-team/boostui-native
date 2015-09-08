define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var NativeElement = require("boost/NativeElement");
    var ViewStylePropTypes = require("boost/ViewStylePropTypes");
    var StyleSheet = require("boost/StyleSheet");

    //var NATIVE_VIEW_TYPE = "WrappedViewGroup";
    var NATIVE_VIEW_TYPE = 0; //与WebNativeMapping.TypeMapping.TYPES中序号对应

    var ViewStyle = derive(StyleSheet, ViewStylePropTypes);
    var View = derive(NativeElement, function () {
        //this._super(NATIVE_VIEW_TYPE, "View");
        NativeElement.call(this, NATIVE_VIEW_TYPE, "View");
    }, {
        __getStyle: function () {
            return new ViewStyle();
        }
    });
    module.exports = View;
});
