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


    var StyleSheet = derive(EventTarget, function () {
        //this._super();
        EventTarget.call(this);
        this.__styleProps__ = {};
    }, {

        //TODO
        // 现在的 cssText 是 Native 的格式，需要转换
        /*
        "get cssText": function () {
            return JSON.stringify(this.__getProps());
        },
       */
        "set cssText": function (value) {
            this.__styleProps__ = {};
            var list = String(value).split(";");
            var count = list.length;
            var index;
            var item;
            var parts;
            var key;

            for (index = 0; index < count; index++) {
                item = list[index];
                parts = item.split(":");
                key = toCamelCase(trim(parts[0]));
                this[key] = trim(parts[1]);
            }
        },
        __getProps: function () {
            return this.__styleProps__;
        },
        __onPropertyChange: function (key, value, origValue) {
            // nothing
        }
    });

    function toCamelCase(str) {
        return str.replace(/-+(.)?/g, function (match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
    }


    StyleSheet.createPropTypes = function ( /*base..., */ config) {
        var proto = {};
        var count = arguments.length;
        var index = 0;

        for (index = 0; index < count - 1; index++) {
            copyProperties(proto, arguments[index]);
        }

        config = arguments[index];

        each(config, function (validator, key) {

            //为了性能，直接从 __styleProps__ 获取值
            //proto["get " + key] = function () {
            //    return hasOwnProperty(this.__styleProps__, key) ?
            //        this.__styleProps__[key] : "";
            //};

            proto["set " + key] = function (value) {
                var origValue = this.__styleProps__[key];
                var event;
                value = validator(value);
                if (value !== origValue) {
                    this.__styleProps__[key] = value;
                    //改为直接的函数调用，提高性能
                    this.__onPropertyChange(key, value, origValue);
                    //event = new PropertyChangeEvent(this, key, value, origValue);
                    //this.dispatchEvent(event);
                }
            };
        });

        return proto;
    };

    StyleSheet.validator = {
        oneOf: function ( /*list*/ ) {
            var list = slice(arguments);
            return function (value) {
                value = trim(value);
                assert(list.indexOf(value) > -1, "value mast be one of " + list.join());
                return value;
            };
        },

        string: function (value) {
            return String(value);
        },

        font: function (value) {
            if (value === "boostfont") {
                return "assets:" + value;
            }
            return String(value);
        },

        dp: function (value) {
            assert(!isNaN(value) && isFinite(value), "must be number");
            value = parseFloat(value);
            return value * DEVICE_PIXEL_RATIO;
        },

        number: function (value) {
            assert(!isNaN(value) && isFinite(value), "must be number");
            value = parseFloat(value);
            return value;
        },

        boolean: function (value) {
            assert(value === true || value === false, "must be boolean");
            return value;
        },

        color: (function () {
            var NAMEED_COLORS = {
                "black": "#ff000000",
                "silver": "#ffc0c0c0",
                "gray": "#ff808080",
                "white": "#ffffffff",
                "maroon": "#ff800000",
                "red": "#ffff0000",
                "purple": "#ff800080",
                "fuchsia": "#ffff00ff",
                "green": "#ff008000",
                "lime": "#ff00ff00",
                "olive": "#ff808000",
                "yellow": "#ffffff00",
                "navy": "#ff000080",
                "blue": "#ff0000ff",
                "teal": "#ff008080",
                "aqua": "#ff00ffff",
                "orange": "#ffffa500"
            };
            var REG_HEX_RGB = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/;
            var REG_HEX_RRGGBB = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/;
            var REG_RGB = /^rgb\s*\(\s*(\d+|\d*\.\d+)\s*,\s*(\d+|\d*\.\d+)\s*,\s*(\d+|\d*\.\d+)\s*\)$/;
            var REG_RGBA = /^rgba\s*\(\s*(\d+|\d*\.\d+)\s*,\s*(\d+|\d*\.\d+)\s*,\s*(\d+|\d*\.\d+)\s*,\s*(\d+|\d*\.\d+)\s*\)$/;
            //^[1-9]/d*/./d*|0/./d*[1-9]/d*$

            function getHexValue(value, maxValue) {
                value = Math.round(value * 0xFF / maxValue);
                return value < 0x10 ? "0" + value.toString(16) : value.toString(16);
            }

            return function (value) {

                value = trim(value).toLowerCase();

                if (hasOwnProperty(NAMEED_COLORS, value)) {
                    return NAMEED_COLORS[value];
                }
                if (REG_HEX_RGB.test(value)) {
                    return "#ff" +
                        RegExp.$1 + RegExp.$1 +
                        RegExp.$2 + RegExp.$2 +
                        RegExp.$3 + RegExp.$3;
                }
                if (REG_HEX_RRGGBB.test(value)) {
                    return "#ff" +
                        RegExp.$1 +
                        RegExp.$2 +
                        RegExp.$3;
                }
                if (REG_RGB.test(value)) {
                    return "#ff" +
                        getHexValue(parseFloat(RegExp.$1), 0xFF) + // r
                        getHexValue(parseFloat(RegExp.$2), 0xFF) + // g
                        getHexValue(parseFloat(RegExp.$3), 0xFF); // b
                }
                if (REG_RGBA.test(value)) {
                    return "#" +
                        getHexValue(parseFloat(RegExp.$4), 1) + // a
                        getHexValue(parseFloat(RegExp.$1), 0xFF) + // r
                        getHexValue(parseFloat(RegExp.$2), 0xFF) + // g
                        getHexValue(parseFloat(RegExp.$3), 0xFF); // b
                }
                assert(false, "unknow color: \"" + value + "\"");
            };
        })()

    };

    module.exports = StyleSheet;

});
