define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var slice = require("base/slice");
    var EventTarget = require("boost/EventTarget");
    var tagMap = require("boost/tagMap");
    var bridge = require("boost/bridge");

    var NativeObject = derive(EventTarget, function (tag) {
        var origObj;

        //this._super();
        EventTarget.call(this);
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
            bridge.call(this.__tag__, method, args);
        },

        __onEvent: function (type, event) {
            //do nothing
        },

        destroy: function () {
            nativeGlobal.destroyObject(this.__tag__);
        }
    });

    //TODO: @ls:
    // 本方法只在NativeGlobalObject创建时有使用，也就是说，库中只暴露了global上的原生方法、只调用到ReactPageEntity上的方法？
    // 但使用者可以创建NativeObject后自己调用其bindNative以调用到原生上相应对象的方法是吧？
    NativeObject.bindNative = function (method) {
        return function () {
            this.__callNative(method, slice(arguments));
        };
    };

    var GLOBAL_TAG = null;
    var NativeGlobalObject = derive(NativeObject, function () {
        //this._super(GLOBAL_TAG);
        NativeObject.call(this, GLOBAL_TAG);
    }, {
        createView: NativeObject.bindNative("createView"),
        updateView: NativeObject.bindNative("updateView"),
        addView: NativeObject.bindNative("addView"),
        removeView: NativeObject.bindNative("removeView"),
        removeAllViews: NativeObject.bindNative("removeAllViews"),
        createAnimation: NativeObject.bindNative("createAnimation"),
        startAnimation: NativeObject.bindNative("startAnimation"),
        cancelAnimation: NativeObject.bindNative("cancelAnimation"),
        //FOR TEST
        test: NativeObject.bindNative("test"),

        //__destroy: NativeObject.bindNative("destroy"),
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


    // 监听统一的 boost 事件
    document.addEventListener("boost", function (e) {
        var origin = e.origin;
        var target = NativeObject.getByTag(origin);
        var type = e.boostEventType.toLowerCase();
        //console.log("origin:" + origin, "type:" + type, e);
        if (target) {
            // 这里为了提高效率，就不用 dispatchEvent 那一套了。
            target.__onEvent(type, e);
        } else if (type === "boosterror") {
            console.error(e.stack);
            //TODO 构建错误显示界面
            //throw new NativeError(e.stack);
        }
    }, false);

    // 页面卸载时,删除所有的 NativeView
    window.addEventListener("unload", function (e) {
        nativeGlobal.removeAllViews();
        bridge.flush();
    });

    // 页面加载时，先尝试删除所有 NativeView
    nativeGlobal.removeAllViews();

    module.exports = NativeObject;
});
