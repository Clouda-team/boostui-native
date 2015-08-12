define(function (require, exports, module) {
    "use strict";

    var DEVICE_PIXEL_RATIO = window.devicePixelRatio;
    var derive = require("base/derive");
    var trim = require("base/trim");
    var copyProperties = require("base/copyProperties");
    var hasOwnProperty = require("base/hasOwnProperty");
    var each = require("base/each");
    var slice = require("base/slice");
    var assert = require("base/assert");
    var EventTarget = require("boost/EventTarget");
    var PropertyChangeEvent = require("boost/PropertyChangeEvent");

    // Easily-parseable/retrievable ID or TAG or CLASS selectors
    var rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;

    var deep = 0;
    var tagMap = {};
    var idMap = {};
    var classMap = {};

    var checkMap = {};

    var Selector = derive(Object, function (str) {
        this.__str__ = str;
        this.__selector = null;
        this.__matcher = null;
    }, {
        select: function (element, results) {
            results = results || [];
            if (this.__selector === null) {
                this.__selector = compileSelector(this.__str__);
            }
            this.__selector(element, results);
            return results;
        },
        match: function (element, context) {
            results = results || [];
            if (this.__matcher === null) {
                this.__matcher = compileMatcher(this.__str__);
            }
            return this.__matcher(element, context);
        }
    });

    function compileSelector(str) {
        var parts = str.split(",");
        parts = parts.filter(function (item) {
            return trim(item) !== 
        });

        return function () {

        };
    }

    var selectorMap = {};

    Selector.getSelector = function (str) {
        str = trim(str);
        if (hasOwnProperty(selectorMap, str)) {
            return selectorMap[str];
        }

        var selector = new Selector(str);
        selectorMap[str] = selector;
        return selector;
    };

    Selector.freeze = function () {
        deep = 1;
    };

    Selector.unfreeze = function () {
        deep = 0;
        tagMap = {};
        idMap = {};
        classMap = {};
    };

    module.exports = Selector;
});
