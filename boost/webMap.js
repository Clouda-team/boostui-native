define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var $ = require("boost/$");
    var assert = require("base/assert");
    var each = require("base/each");
    var webDebugger = require('./webDebugger');
    var ID_ATTR_NAME = "__web_map_id";

    var WebMap = derive(Object, {
        _boostMap: {},
        _webMap: {},

        getBoostElement: function (webElement) {
            assert(webDebugger.isActive(), "should not use webMap when inUse() === false");

            return this._boostMap[this._getId(webElement)];
        },
        getWebElement: function (boostElement) {
            assert(webDebugger.isActive(), "should not use webMap when inUse() === false");

            return this._webMap[this._getId(boostElement)];
        },

        set: function (boostElement, webElement) {
            assert(webDebugger.isActive(), "should not use webMap when inUse() === false");

            var id = boostElement.tag;

            this._markId(boostElement, id, "boost");
            this._boostMap[id] = boostElement;

            this._markId(webElement, id, "web");
            this._webMap[id] = webElement;
        },

        getAllWebElements: function () {
            assert(webDebugger.isActive(), "should not use webMap when inUse() === false");

            var result = [];
            each(this._webMap, function (value) {
                result.push(value);
            });
            return result;
        },

        _getId: function (element) {
            return element[ID_ATTR_NAME];
        },
        _markId: function (element, id, type) {
            //为了方便，暂时就直接赋值属性了~（为了不在dom上显示以防用户复制元素时一起复制下来，没有setAttribute）
            element[ID_ATTR_NAME] = id;
        }
    });

    module.exports = new WebMap();
});
