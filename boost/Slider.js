define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var assert = require("base/assert");
    var NativeElement = require("boost/NativeElement");
    var LayoutStyle = require("boost/LayoutStyle");

    //var NATIVE_VIEW_TYPE = "WrappedSlideViewGroup";
    var NATIVE_VIEW_TYPE = 4;

    var Slider = derive(NativeElement, function () {
        this._super(NATIVE_VIEW_TYPE, "Slider");
    }, {
        __getStyle: function () {
            //assert(false, "Slider 不支持 style 属性");
            return new LayoutStyle();
        },
        "get maxSlideWidth": function () {
            return this.__config__.maxSlideWidth || 0;
        },
        "set maxSlideWidth": function (value) {
            assert(!isNaN(value) && isFinite(value), "maxSlideWidth 必须为有效数字");
            value = parseFloat(value);
            this.__update("maxSlideWidth", value);
        }
    });
    module.exports = Slider;
});
