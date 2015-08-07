define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var assert = require("base/assert");
    var EventTarget = require("boost/EventTarget");
    var NativeObject = require("boost/NativeObject");
    var NativeElement = require("boost/NativeElement");
    //var TouchEvent = require("boost/TouchEvent");
    //var Element = require("boost/Element");
    //
    var nativeGlobal = NativeObject.global;

    //var _super = Element.prototype;
    var Animation = derive(EventTarget, function (type, config) {
        EventTarget.call(this);
        this.__type__ = type;
        this.__native__ = null;
        //this.__config__ = config;
        this.__create(this.__type__, config);
    }, {
        __create: function (type, config) {
            var self = this;
            var nativeObj = this.__native__ = new NativeObject();
            var tag = nativeObj.tag;
            nativeObj.__onEvent = function (type, e) {
                self.__onEvent(type, e);
            };
            nativeGlobal.createAnimation(tag, type, config);
        },
        start: function (element) {
            assert(element instanceof NativeElement, "Animation must apply on NativeElement");
            nativeGlobal.startAnimation(element.nativeObject.tag, this.__native__.tag);
        },
        cancel: function () {
            nativeGlobal.cancelAnimation(this.__native__.tag);
        },
        __onEvent: function (type, e) {
            var event;
            switch (type) {
                // TODO
                //case "touchstart":
                //case "touchend":
                //event = new TouchEvent(this, type, e.x, e.y);
                //this.dispatchEvent(event);
                //break;
                default: console.log("unknow event:" + type, e);
            }
        }
    });

    module.exports = Animation;
});
