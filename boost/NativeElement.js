define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var assert = require("base/assert");
    var NativeObject = require("boost/NativeObject");
    var Element = require("boost/Element");

    var nativeGlobal = NativeObject.global;

    var ROOT_ELEMENT_TAG = "tag_nativeview";

    var NativeElement = derive(Element, function (type, tag) {
        this._super(tag);
        this.__type__ = type;
        this.__native__ = null;
        this.__config__ = this.__getDefaultConfig();
        this.__createView(this.__type__, this.__config__);
    }, {
        __createView: function (type, config) {
            var nativeObj = this.__native__ = new NativeObject();
            var tag = nativeObj.tag;
            nativeGlobal.createView(tag, type, config);
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
            nativeGlobal.addView(tag, child.__native__.tag, index);
            return this._super(child, index);
        },
        __removeChildAt: function (index) {
            var tag = this.__native__.tag;
            nativeGlobal.removeView(tag, index);
            return this._super(index);
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
            return this._super(key, value, origValue);
        }
    });

    var NativeRootElement = derive(NativeElement, function () {
        this._super(null, "NATIVE_ROOT");
    }, {
        __createView: function () {
            //TODO: 不用调用nativeGlobal.createView吗？
            this.__native__ = new NativeObject(ROOT_ELEMENT_TAG);
        }
    });

    NativeElement.__rootElement = new NativeRootElement();

    module.exports = NativeElement;
});
