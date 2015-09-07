/**
 * @file 负责监控web中元素，将其改动更新至boost 被webMap中调用启动
 */

define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var $ = require("boost/$");
    var assert = require("base/assert");
    require("boost/webMap");
    var INTERVAL = 1000;

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
            switch (styleName) {
                case "margin":
                case "padding":
                case "border-width":
                case "border-color":
                    //TODO
                    break;
                default :
                    if (/^[\d\.]+px$/.test(styleValue)) {
                        boostElement.style[styleName] = parseFloat(styleValue);
                    } else if (styleValue === "auto") {
                        boostElement.style[styleName] = null;
                    } else {
                        boostElement.style[styleName] = styleValue;
                    }
                    break;
            }
        }
    });

    module.exports = new WebMonitor();
});
