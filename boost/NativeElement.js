define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var assert = require("base/assert");
    var NativeObject = require("boost/NativeObject");
    var TouchEvent = require("boost/TouchEvent");
    var Element = require("boost/Element");

    var nativeGlobal = NativeObject.global;

    //var ROOT_ELEMENT_TAG = "tag_nativeview";
    var ROOT_ELEMENT_TAG = 0;

    var _super = Element.prototype;
    var NativeElement = derive(Element, function (type, tag) {
        //this._super(tag);
        Element.call(this, tag);
        this.__type__ = type;
        this.__native__ = null;
        this.__config__ = this.__getDefaultConfig();
        this.__createView(this.__type__, this.__config__);
    }, {
        "get nativeObject": function () {
            return this.__native__;
        },
        __createView: function (type, config) {
            var self = this;
            var nativeObj = this.__native__ = new NativeObject();
            var tag = nativeObj.tag;
            nativeObj.__onEvent = function (type, e) {
                self.__onEvent(type, e);
            };
            nativeGlobal.createView(tag, type, config);
        },
        __onEvent: function (type, e) {
            //console.log("tag:" + this.__native__.tag, "type:" + this.__type__, "event:" + type);
            var event;
            switch (type) {
            case "touchstart":
            case "touchend":
                event = new TouchEvent(this, type, e.x, e.y);
                this.dispatchEvent(event);
                break;
            default:
                console.log("unknow event:" + type, e);
            }
        },
        __getDefaultConfig: function () {
            // TODO more
            return {};
            //return this.style.__getProps();
        },
        __addChildAt: function (child, index) {
            //appendChild: function (child) {
            var tag = this.__native__.tag;
            assert(child instanceof NativeElement, "child must be a NativeElement");
            //var ret = this._super(child, index);
            var ret = _super.__addChildAt.call(this, child, index);
            //这个地方一定要在 _super 调用之后,因为在之前有可能添加和删除的顺序会错
            nativeGlobal.addView(tag, child.__native__.tag, index);
            return ret;
        },
        __removeChildAt: function (index) {
            var tag = this.__native__.tag;
            //var ret = this._super(index);
            var ret = _super.__removeChildAt.call(this, index);
            //这个地方一定要在 _super 调用之后,因为在之前有可能添加和删除的顺序会错
            nativeGlobal.removeView(tag, index);
            return ret;
        },
        __update: function (key, value) {
            var config = this.__config__;
            var oldValue = config[key];
            var tag;
            var obj;
            if (value !== oldValue) {
                obj = {};
                config[key] = value;
                obj[key] = value;
                tag = this.__native__.tag;
                nativeGlobal.updateView(tag, this.__type__, obj);
            }
        },
        //__styleChange
        __styleChange: function (key, value, origValue) {
            this.__update(key, value);
            //return this._super(key, value, origValue);
            return _super.__styleChange.call(this, key, value, origValue);
        }
    });

    var NativeRootElement = derive(NativeElement, function () {
        //this._super(null, "NATIVE_ROOT");
        NativeElement.call(this, null, "NATIVE_ROOT");
    }, {
        __createView: function () {
            //TODO @ls: 不用调用nativeGlobal.createView吗？只是一个虚拟的root?
            this.__native__ = new NativeObject(ROOT_ELEMENT_TAG);
        }
    });

    NativeElement.__rootElement = new NativeRootElement();

    module.exports = NativeElement;
});
