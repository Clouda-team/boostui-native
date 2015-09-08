define(function (require, exports, module) {
    "use strict";

    var slice = require("base/slice");
    var assert = require("base/assert");
    var trim = require("base/trim");
    var hasOwnProperty = require("base/hasOwnProperty");

    var DEVICE_PIXEL_RATIO = window.devicePixelRatio;


    var validator = {
        map: function (set) {
            return function (value) {
                value = trim(value);
                assert(hasOwnProperty(set, value), "unknow key \"" + value + "\"");
                return set[value];
            };
        },
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
                return "assets:boostfont";
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
            if (value !== true && value !== false) {
                value = trim(String(value)).toLowerCase();
                value = value === "true" ? true : value === "false" ? false : assert(false, "must be boolean");
            }
            return value;
        },

        color: (function () {
            var NAMEED_COLORS = {
                "transparent": "#00000000",
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
                "orange": "#ffffa500",
                "transparent": "#00000000"
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

    module.exports = validator;

});
