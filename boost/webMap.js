define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var $ = require("boost/$");
    var assert = require("base/assert");
    var each = require("base/each");
    var webDebugger = require('./webDebugger');
    var ID_ATTR_NAME = "__tag__";
    var IN_USAGE_KEY = "web-debug";
    var inUse = !!localStorage.getItem(IN_USAGE_KEY); //非实时生效

    if (inUse) {
        document.documentElement.style.visibility = 'hidden';
    }

    var WebMap = derive(Object, {
        _boostMap: {},
        _webMap: {},

        inUse: function () {
            return inUse;
        },
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

            this._markId(boostElement, id);
            this._boostMap[id] = boostElement;

            this._markId(webElement, id);
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
            return element.getAttribute(ID_ATTR_NAME);
        },
        _markId: function (element, id) {
            element.setAttribute(ID_ATTR_NAME, id);
        }
    });

    module.exports = new WebMap();
});
