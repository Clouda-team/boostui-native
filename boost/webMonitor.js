/**
 * @file 负责监控web中元素，将其改动更新至boost 被webMap中调用启动
 */

define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var $ = require("boost/$");
    var assert = require("base/assert");
    require("boost/webMap");
    var INTERVAL = 30;
    function toCamelCase(str) { //TODO: move to base/
        return str.replace(/-+(.)?/g, function (match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
    }

    var WebMonitor = derive(Object, {
        _setIntervalHandle: null,

        start: function () {
            assert(this._setIntervalHandle === null, "already been started");

            this._setIntervalHandle = setInterval(this.sync.bind(this), INTERVAL);
        },

        sync: function () {
            var self = this;
            var webMap = require("boost/webMap"); //因为有循环依赖，需在此使用时重新require
            webMap.getAllWebElements().forEach(function (webElement) {
                var tagName = webElement.tagName.toUpperCase();
                var boostElement = webMap.getBoostElement(webElement);

                if (tagName === "TEXT" || tagName === "TEXTINPUT") {
                    boostElement.value = webElement.innerHTML; //innerText can't get value~
                }

                boostElement.className = webElement.className; //FIXME: can't trigger style update

                var styleText = webElement.getAttribute("style");
                if (styleText) {
                    var styleList = styleText.split(";");
                    styleList = styleList.filter(function (styleItem) { return styleItem.trim().length > 0; });
                    styleList.forEach(function (styleItem) {
                        var tempArray = styleItem.split(":");
                        self._handleRule(boostElement,  tempArray[0].trim(), tempArray[1].trim());
                    });
                }
            });
        },

        _handleRule: function (boostElement, styleName, styleValue) {
            var keyMap = {
                "margin": [
                    'margin-top',
                    'margin-right',
                    'margin-bottom',
                    'margin-left'
                ],
                "padding": [
                    'padding-top',
                    'padding-right',
                    'padding-bottom',
                    'padding-left'
                ],
                "border-width": [
                    'border-top-width',
                    'border-right-width',
                    'border-bottom-width',
                    'border-left-width'
                ],
                "border-color": [
                    'border-top-color',
                    'border-right-color',
                    'border-bottom-color',
                    'border-left-color'
                ]
            };
            switch (styleName) {
                case "margin":
                case "padding":
                case "border-width":
                case "border-color":
                    var subStyleValues = styleValue.split(/\s+/);
                    if (subStyleValues.length === 1) {
                        subStyleValues.push(subStyleValues[0]); //right
                        subStyleValues.push(subStyleValues[0]); //bottom
                        subStyleValues.push(subStyleValues[0]); //left
                    } else if (subStyleValues.length === 2) {
                        subStyleValues.push(subStyleValues[0]); //bottom
                        subStyleValues.push(subStyleValues[1]); //left
                    } else if (subStyleValues.length === 3) {
                        subStyleValues.push(subStyleValues[1]); //left
                    }
                    keyMap[styleName].forEach(function (subStyleKey, index) {
                        boostElement.style[webKeyToBoostKey(subStyleKey)] = webValueToBoostValue(subStyleValues[index]);
                    });
                    break;
                default :
                    boostElement.style[webKeyToBoostKey(styleName)] = webValueToBoostValue(styleValue);
                    break;
            }

            function webValueToBoostValue (webValue) {
                if (/^(?:\-)?[\d\.]+px$/.test(webValue)) {
                    return parseFloat(webValue);
                } else if (webValue === "auto") {
                    return null;
                } else {
                    return webValue;
                }
            }
            function webKeyToBoostKey (webKey) {
                return toCamelCase(webKey);
            }
        }
    });

    module.exports = new WebMonitor();
});
