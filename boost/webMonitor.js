/**
 * @file 负责监控web中元素，将其改动更新至boost 被webMap中调用启动
 */

define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var $ = require("boost/$");
    var assert = require("base/assert");
    var each = require("base/each");
    require("boost/webMap");
    require("boost/webDebugger");
    require("boost/boost");
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

            var self = this;

            var webDebugger = require("boost/webDebugger");
            var boost = require("boost/boost");
            var observer = new MutationObserver(function (records) {
                if (webDebugger.doNotUpdateBoostOnce) {
                    webDebugger.doNotUpdateBoostOnce = false;
                    return; //avoid dead loop
                }

                records.forEach(function (record) {
                    var webMap = require("boost/webMap"); //因为有循环依赖，需在此使用时重新require
                    var webElement;
                    var boostElement;
                    switch (record.type) {
                        case "attributes":
                            webElement = record.target;
                            boostElement = webMap.getBoostElement(webElement);
                            if (record.attributeName === 'style') {
                                self._handleStyle(boostElement, webElement.getAttribute("style"));
                            } else if (record.attributeName === "class") {
                                webDebugger.doNotUpdateWeb = true;
                                boostElement.className = webElement.className; //FIXME: can't trigger style update by className
                                webDebugger.doNotUpdateWeb = false;
                            } else {
                                webDebugger.doNotUpdateWeb = true;
                                boostElement.setAttribute(record.attributeName, webElement.getAttribute(record.attributeName));
                                webDebugger.doNotUpdateWeb = false;
                            }
                            break;
                        case "characterData":
                            webElement = record.target.parentElement;
                            boostElement = webMap.getBoostElement(webElement);
                            var tagName = webElement.tagName.toUpperCase();
                            if (tagName === "TEXT" || tagName === "TEXTINPUT") {
                                webDebugger.doNotUpdateWeb = true;
                                boostElement.value = webElement.innerHTML; //innerText can't get value~
                                webDebugger.doNotUpdateWeb = false;
                            }
                            break;
                        case "childList":
                            webElement = record.target;
                            boostElement = webMap.getBoostElement(webElement);

                            each(record.removedNodes, function (removedNode) {
                                var removedBoostElement = webMap.getBoostElement(removedNode);
                                webDebugger.doNotUpdateWeb = true;
                                boostElement.removeChild(removedBoostElement); //but do not destroy, for maybe is move/cut
                                webDebugger.doNotUpdateWeb = false;
                            });

                            each(record.addedNodes, function (addedNode) {
                                if (addedNode.nodeName === "#text") {
                                    return; //文本节点不处理
                                }
                                var addedBoostNode = webMap.getBoostElement(addedNode);
                                if (!addedBoostNode) {
                                    //TODO: 改为直接从xml解析一个html片断（含子元素、value、样式应用的处理等）
                                    webDebugger.doNotUpdateWeb = true;
                                    addedBoostNode = boost.createElement(addedNode.tagName);
                                    webMap.set(addedBoostNode, addedNode);
                                    //TODO: 使用与上面相同的逻辑来处理
                                    each(addedNode.attributes, function (attr) {
                                        addedBoostNode[attr.name] = attr.value;
                                    });
                                    addedBoostNode.value = addedNode.innerHTML;
                                    webDebugger.doNotUpdateWeb = false;
                                }
                                if (record.nextSibling) {
                                    webDebugger.doNotUpdateWeb = true;
                                    boostElement.insertBefore(addedBoostNode, webMap.getBoostElement(record.nextSibling));
                                    webDebugger.doNotUpdateWeb = false;
                                } else {
                                    webDebugger.doNotUpdateWeb = true;
                                    boostElement.appendChild(addedBoostNode);
                                    webDebugger.doNotUpdateWeb = false;
                                }
                            });
                            break;
                    }
                });
            });
            observer.observe(document.documentElement, {
                childList: true,
                attributes: true,
                characterData: true,
                subtree: true
            });
        },

        _handleStyle: function(boostElement, styleText) {
            var self = this;
            var styleList = styleText.split(";");
            styleList = styleList.filter(function (styleItem) { return styleItem.trim().length > 0; });
            //TODO: 注释、删除样式的处理（对比oldValue?）
            styleList.forEach(function (styleItem) {
                var tempArray = styleItem.split(":");
                self._handleStyleItem(boostElement,  tempArray[0].trim(), tempArray[1].trim());
            });
        },

        _handleStyleItem: function (boostElement, styleName, styleValue) {
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
            var webDebugger = require("boost/webDebugger");
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
                    webDebugger.doNotUpdateWeb = true;
                    keyMap[styleName].forEach(function (subStyleKey, index) {
                        boostElement.style[webKeyToBoostKey(subStyleKey)] = webValueToBoostValue(subStyleValues[index]);
                    });
                    webDebugger.doNotUpdateWeb = false;
                    break;
                default :
                    webDebugger.doNotUpdateWeb = true;
                    boostElement.style[webKeyToBoostKey(styleName)] = webValueToBoostValue(styleValue);
                    webDebugger.doNotUpdateWeb = false;
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
        },

        _hasChild: function (parent, child) {
            var has = false;
            each(parent.childNodes, function (each) {
                if (each === child) {
                    has = true;
                }
            });
            return has;
        }
    });

    module.exports = new WebMonitor();
});
