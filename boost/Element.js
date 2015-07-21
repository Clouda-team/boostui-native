define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var assert = require("base/assert");
    var EventTarget = require("boost/EventTarget");
    var StyleSheet = require("boost/StyleSheet");
    var trim = require("base/trim");

    var Element = derive(EventTarget, function (tag) {
        this._super();
        this.__tag__ = tag.toUpperCase();
        this.__id__ = null;
        this.__style__ = null;
        this.__className__ = null;
        this.__classList__ = [];
        this.__children__ = [];
        this.__parent__ = null;
    }, {
        "set id": function (value) {
            this.__id__ = value;
        },
        "get id": function () {
            return this.__id__;
        },
        "set className": function (value) {
            this.__className__ = value;
            var classList = [];
            var list = value.split(" ");
            var count = list.length;
            var index;
            var item;
            for (index = 0; index < count; index++) {
                item = trim(list[index]);
                if (item.length > 0) {
                    classList.push(item);
                }
            }
            this.__classList__ = classList;
        },
        "get className": function () {
            return this.__className__;
        },
        "get classList": function () {
            return this.__classList__;
        },
        "get tagName": function () {
            return this.__tag__;
        },
        "get style": function () {
            var style;
            var self = this;
            if (this.__style__ === null) {
                style = this.__getStyle();
                style.addEventListener("propertychange", function (e) {
                    self.__styleChange(e.key, e.value, e.origValue);
                });
                this.__style__ = style;
            }
            return this.__style__;
        },
        "get childNodes": function () {
            return this.__children__;
        },
        "get firstChild": function () {
            return this.hasChildNodes() ? this.childNodes[0] : null;
        },
        "get lastChild": function () {
            var index = this.childNodes.length - 1;
            return this.hasChildNodes() ? this.childNodes[index] : null;
        },
        "get nextSibling": function () {
            var index;
            var count;
            var parentNode = this.parentNode;
            var parentNodeChildren;
            if (parentNode !== null) {
                parentNodeChildren = parentNode.childNodes;
                count = parentNodeChildren.length;
                index = parentNodeChildren.indexOf(this);
                if (index > -1 && index + 1 < count) {
                    return parentNodeChildren[index + 1];
                }
            }

            return null;
        },
        "get parentNode": function () {
            return this.__parent__;
        },
        "get previousSibling": function () {
            var index;
            var parentNode = this.parentNode;
            var parentNodeChildren;
            if (parentNode !== null) {
                parentNodeChildren = parentNode.childNodes;
                index = parentNodeChildren.indexOf(this);
                if (index > 0) {
                    return parentNodeChildren[index - 1];
                }
            }

            return null;
        },
        __getStyle: function () {
            return new StyleSheet();
        },
        __styleChange: function (key, value, origValue) {
            // do nothing
        },
        __addChildAt: function (child, index) {
            var childParentNode = child.parentNode;
            if (childParentNode !== null) {
                childParentNode.removeChild(child);
            }
            this.__children__.splice(index, 0, child);
            child.__parent__ = this;
        },
        __removeChildAt: function (index) {
            var child = this.childNodes[index];
            this.childNodes.splice(index, 1);
            child.__parent__ = null;
        },
        appendChild: function (child) {
            this.__addChildAt(child, this.__children__.length);
            return child;
        },
        hasChildNodes: function () {
            return this.childNodes.length > 0;
        },
        insertBefore: function (newNode, referenceNode) {
            var childNodes = this.childNodes;
            var index = childNodes.indexOf(referenceNode);
            if (index < 0) {
                //TODO ERROR
                return null;
            }
            this.__addChildAt(newNode, index);
            return newNode;
        },
        removeChild: function (child) {
            var index = this.childNodes.indexOf(child);
            if (index < 0) {
                //TODO ERROR
                return null;
            }
            this.__removeChildAt(index);
            return child;
        },
        replaceChild: function (newChild, oldChild) {
            var index = this.childNodes.indexOf(oldChild);
            if (index < 0) {
                //TODO ERROR
                return null;
            }
            if (newChild.parentNode !== null) {
                newChild.parentNode.removeChild(newChild);
            }
            this.childNodes.splice(index, 1, newChild);
            oldChild.__parent__ = null;
            return oldChild;
        },
        __findElement: function (callback) {
            var childNodes = this.childNodes;
            var index;
            var count = childNodes.length;
            var child;
            for (index = 0; index < count; index++) {
                child = childNodes[index];
                if (callback(child) === true) {
                    return true;
                }
                if (child.__findElement(callback)) {
                    return true;
                }
            }

            return false;
        },
        getElementById: function (id) {
            var ret = null;
            this.__findElement(function (element) {
                if (element.id === id) {
                    ret = element;
                    //如果找到指定 Element, 返回 true, 停止遍历
                    return true;
                }
                return false;
            });

            return ret;
        },
        getElementsByClassName: function (className) {
            var ret = [];

            this.__findElement(function (element) {
                if (element.classList.indexOf(className) > -1) {
                    ret.push(element);
                }
                //始终返回 false, 继续查找
                return false;
            });

            return ret;
        },
        getElementsByTagName: function (tag) {
            tag = tag.toUpperCase();
            var ret = [];

            this.__findElement(function (element) {
                if (element.tagName === tag) {
                    ret.push(element);
                }
                //始终返回 false, 继续查找
                return false;
            });

            return ret;
        },
        /*
        querySelector: function (selector) {
            var func = getSelectorFunction(selector);
            var ret = [];
            func(this, ret, 1);
            return ret;
        },
       */
        querySelectorAll: function (selector) {
            var match = rquickExpr.exec(selector);
            var m;
            assert(match !== null, "现在只支持简单的选择器: #id .class tag");

            if ((m = match[1])) {
                // ID selector
                return [this.getElementById(m)];
            } else if (match[2]) {
                // Type selector
                return this.getElementsByTagName(selector);
            } else if (m = match[3]) {
                // Class selector
                return this.getElementsByClassName(m);
            }
        },
        setAttribute: function (name, value) {
            switch (name.toLowerCase()) {
            case "class":
                this.setAttribute("className", value);
                break;
            case "style":
                this.style.cssText = value;
                break;
            default:
                this[name] = value;
                break;
            }
        }
    });

    // Easily-parseable/retrievable ID or TAG or CLASS selectors
    var rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;

    module.exports = Element;
});
