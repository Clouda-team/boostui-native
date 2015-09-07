define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var $ = require("boost/$");
    var assert = require("base/assert");
    var ID_ATTR_NAME = "_i";
    var IN_USAGE_KEY = "web-debug";
    var inUse = !!localStorage.getItem(IN_USAGE_KEY); //非实时生效

    if (inUse) {
        document.documentElement.style.visibility = 'hidden';
    }

    var WebMap = derive(Object, {
        _boostMap: {},
        _webMap: {},
        _curId: 0,

        inUse: function () {
            return inUse;
        },
        getBoostElement: function (webElement) {
            assert(this.inUse(), "should not use webMap when inUse() === false");

            return this._boostMap[this._getId(webElement)];
        },
        getWebElement: function (boostElement) {
            assert(this.inUse(), "should not use webMap when inUse() === false");

            return this._webMap[this._getId(boostElement)];
        },
        set: function (boostElement, webElement) {
            assert(this.inUse(), "should not use webMap when inUse() === false");

            var id = ++this._curId;

            this._markId(boostElement, id);
            this._boostMap[id] = boostElement;

            this._markId(webElement, id);
            this._webMap[id] = webElement;
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
