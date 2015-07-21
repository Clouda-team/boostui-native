define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var assert = require("base/assert");
    var NativeElement = require("boost/NativeElement");
    var LayoutStyle = require("boost/LayoutStyle");

    var NATIVE_VIEW_TYPE = "WrappedScrollView";

    var ScrollView = derive(NativeElement, function () {
        this._super(NATIVE_VIEW_TYPE, "ScrollView");
    }, {
        __getStyle: function () {
            //assert(false, "ScrollView 不支持 style 属性");
            return new LayoutStyle();
        }
    });
    module.exports = ScrollView;
});
