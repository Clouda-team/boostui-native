define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var slice = require("base/slice");
    var EventTarget = require("boost/EventTarget");
    var tagMap = require("boost/tagMap");
    var queue = require("boost/bridge");

    var NativeObject = derive(EventTarget, function (tag) {
        var origObj;

        this._super();
        if (tag === undefined) {
            tag = tagMap.genTag();
        }

        origObj = tagMap.get(tag);
        if (origObj !== null && origObj instanceof NativeObject) {
            origObj.destroy();
        }

        tagMap.set(tag, this);
        this.__tag__ = tag;
    }, {
        "get tag": function () {
            return this.__tag__;
        },

        __callNative: function (method, args) {
            queue.call(this.__tag__, method, args);
        },

        destroy: function () {
            nativeGlobal.destroyObject(this.__tag__);
        }
    });

    NativeObject.bindNative = function (method) {
        return function () {
            this.__callNative(method, slice(arguments));
        };
    };

    var GLOBAL_TAG = "";
    var NativeGlobalObject = derive(NativeObject, function () {
        this._super(GLOBAL_TAG);
    }, {
        createView: NativeObject.bindNative("createView"),
        updateView: NativeObject.bindNative("updateView"),
        addView: NativeObject.bindNative("addView"),
        removeView: NativeObject.bindNative("removeView"),

        createAnimation: NativeObject.bindNative("createAnimation"),
        __destroy: NativeObject.bindNative("destroy"),
        destroyObject: function (tag) {
            this.__destroy(tag);
        }
    });

    var nativeGlobal = new NativeGlobalObject();
    NativeObject.global = nativeGlobal;

    NativeObject.getByTag = function (tag) {
        var obj = tagMap.get(tag);
        if (obj !== null && obj instanceof NativeObject) {
            return obj;
        }
        return null;
    };

    //TODO Event
    module.exports = NativeObject;

});
