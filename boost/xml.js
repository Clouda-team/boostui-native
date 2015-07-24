define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var assert = require("base/assert");
    var trim = require("base/trim");
    var each = require("base/each");
    var copyProperties = require("base/copyProperties");
    var boost = require("boost/boost");
    var Text = require("boost/Text");
    var EventTarget = require("boost/EventTarget");
    var Event = require("boost/Event");

    function onStateChanged() {
        if (this.readyState == 4) {
            process(this.responseXML);
        }
    }

    function loadFromURL(url) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = onStateChanged;
        xhr.open("GET", url, true);
        xhr.send(null);
    }


    function loadFromString(str) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(str, "text/xml");
        process(xmlDoc);
    }

    function process(document) {
        console.log(document);
        //processElement(document.documentElement, boost.rootElement);
        walkElement(document.documentElement, boost.documentElement);
        applyStyle();

        var event = new Event(xml, "domready");
        xml.dispatchEvent(event);
        //boost.dispatchEvent();
    }


    function processElement(element, nativeParentElement) {
        var str;
        var nativeElement;
        var attributes;
        var attribute;
        var count;
        var index;
        if (element.nodeType === 3) {
            str = trim(element.nodeValue);
            if (str) {
                assert(nativeParentElement instanceof Text, "文本只能添加到 <Text> 节点中");
                nativeParentElement.value += str;
            }
        } else if (element.nodeType === 1) {
            switch (element.tagName.toUpperCase()) {
            case "STYLE":
                parseStyle(element.firstChild.nodeValue);
                break;
            default:
                nativeElement = boost.createElement(element.tagName);
                attributes = element.attributes;
                count = attributes.length;
                for (index = 0; index < count; index++) {
                    attribute = attributes[index];
                    nativeElement.setAttribute(attribute.name, attribute.value);
                }

                walkElement(element, nativeElement);
                nativeParentElement.appendChild(nativeElement);
            }
        }
    }

    function walkElement(element, nativeParentElement) {
        var child;
        var tag;
        for (child = element.firstChild; child !== null; child = child.nextSibling) {
            processElement(child, nativeParentElement);
        }
    }

    function toCamelCase(str) {
        return str.replace(/-+(.)?/g, function (match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
    }


    var parser = null;
    var ruleList = [];

    function parseStyle(str) {
        if (parser === null) {
            parser = new StyleParser();
        }
        parser.parse(str, ruleList);
    }


    function applyStyle() {
        each(ruleList, function (item) {
            var selector = item.selector;
            var elements = boost.querySelectorAll(selector);
            each(elements, function (element) {
                copyProperties(element.style, item.rule);
            });
        });
    }

    var StyleParser = derive(Object, function () {
        var _code = null;
        var _codeChar = null;
        var _index = 0;
        var _count = 0;
    }, {
        parse: function (str, ret) {
            this._code = this.preProcess(str);
            this._codeChar = this._code.split("");
            this._index = 0;
            this._count = this._codeChar.length;
            var selector;
            var rule;

            ret = ret || [];
            while (true) {
                this.ignoreWhiteSpace();
                selector = this.getSelector();
                rule = this.getRule();
                if (selector && rule) {
                    ret.push({
                        selector: selector,
                        rule: rule
                    });
                    continue;
                }
                break;
            }
            return ret;
        },
        preProcess: function (str) {
            return str.replace(/\/\*[\s\S]*?\*\//g, "");
        },
        ignoreWhiteSpace: function () {
            var count = this._count;
            var _codeChar = this._codeChar;
            var code;
            var index;

            for (index = this._index; index < count; index++) {
                code = _codeChar[index];
                if (code !== " " && code !== "\t" && code !== "\r" && code !== "\n") {
                    break;
                }
            }
            this._index = index;
        },
        getSelector: function () {
            var code = this._code;
            var end = code.indexOf("{", this._index);
            var selector;
            if (end < 0) {
                this.end();
                return false;
            }
            selector = code.substring(this._index, end);
            this._index = end;
            return trim(selector);
        },
        getRule: function () {
            var code = this._code;
            var index = this._index;
            var start = code.indexOf("{", index);
            var end;

            if (start < 0) {
                this.end();
                return false;
            }

            end = code.indexOf("}", start);
            if (end < 0) {
                this.end();
                return false;
            }

            this._index = end + 1;
            return this.parseRule(code.substring(start + 1, end));
        },
        parseRule: function (str) {
            var list = str.split(";");
            var count = list.length;
            var index;
            var item;
            var parts;
            var key;
            var ret = {};

            for (index = 0; index < count; index++) {
                item = list[index];
                parts = item.split(":");
                key = toCamelCase(trim(parts[0]));
                ret[key] = trim(parts[1]);
            }
            return ret;
        },
        end: function () {
            this._index = this._count;
        }
    });

    //loadFromURL("test/cart.xml");
    //loadFromString(getXml("cartXml"));
    var xml = new EventTarget();
    xml.loadFromURL = loadFromURL;
    xml.loadFromString = loadFromString;

    module.exports = xml;
});
