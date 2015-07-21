define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var NativeElement = require("boost/NativeElement");
    var LayoutStyle = require("boost/LayoutStyle");

    var NATIVE_VIEW_TYPE = "WrappedImageView";

    var Image = derive(NativeElement, function () {
        this._super(NATIVE_VIEW_TYPE, "Image");
    }, {
        __getStyle: function () {
            return new LayoutStyle();
        },
        "get src": function () {
            return this.__config__.source || "";
        },
        "set src": function (value) {
            this.__update("source", value);
        }
    });
    module.exports = Image;
});
