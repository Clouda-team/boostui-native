define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var assert = require("base/assert");
    var EventTarget = require("boost/EventTarget");
    var StyleSheet = require("boost/StyleSheet");
    var trim = require("base/trim");
    var each = require("base/each");
    var push = [].push;

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
        "get nodeType": function () {
            return 1; //ELEMENT_NODE;
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
        __findChild: function (callback) {
            var childNodes = this.childNodes;
            var index;
            var count = childNodes.length;
            var child;
            for (index = 0; index < count; index++) {
                child = childNodes[index];
                if (callback(child) === true) {
                    return true;
                }
                if (child.__findChild(callback)) {
                    return true;
                }
            }

            return false;
        },
        getElementById: function (id) {
            var ret = null;
            this.__findChild(function (element) {
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

            this.__findChild(function (element) {
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

            this.__findChild(function (element) {
                if (element.tagName === tag) {
                    ret.push(element);
                }
                //始终返回 false, 继续查找
                return false;
            });

            return ret;
        },
        __findParent: function (callback) {
            var node = this;
            while ((node = node.parentNode) !== null) {
                if (callback(node) === true) {
                    return true;
                }
            }
            return false;
        },
        __parentSelect: function (selector) {
            var results = null;
            var match = rquickExpr.exec(selector);
            var m;

            assert(match !== null, "不支持的选择器:\"" + selector + "\",现在只支持简单的选择器: #id .class tag");

            if ((m = match[1])) {
                // ID selector
                this.__findParent(function (element) {
                    if (element.id === m) {
                        results = element;
                        return true;
                    }
                });
            } else if (match[2]) {
                // Type selector
                this.__findParent(function (element) {
                    if (element.tagName === selector) {
                        results = element;
                        return true;
                    }
                });
            } else if (m = match[3]) {
                // Class selector
                this.__findParent(function (element) {
                    if (element.classList.indexOf(m) > -1) {
                        results = element;
                        return true;
                    }
                });
            }
            return results;
        },
        __select: function (selector, results, quick) {
            var self = this;
            results = results || [];
            quick = !!quick;
            selector = trim(selector);
            if (!selector) {
                return results;
            }

            var match = rquickExpr.exec(selector);
            var m;
            if (quick) {
                //assert(match !== null, "现在只支持简单的选择器: #id .class tag");
                assert(match !== null, "不支持的选择器:\"" + selector + "\",现在只支持简单的选择器: #id .class tag");
            }
            if (match !== null) {
                if ((m = match[1])) {
                    // ID selector
                    results.push(this.getElementById(m));
                } else if (match[2]) {
                    // Type selector
                    push.apply(results, this.getElementsByTagName(selector));
                } else if (m = match[3]) {
                    // Class selector
                    push.apply(results, this.getElementsByClassName(m));
                }
            } else {
                each(selector.split(","), function (selector) {
                    var items = selector.split(" ").filter(function (item) {
                        return trim(item).length > 0;
                    });
                    //找出所有满足需求的
                    var list = [];
                    self.__select(items.pop(), list, true);

                    //过滤不满足条件的节点
                    var count = items.length;
                    each(list, function (element) {
                        var index = count;
                        var node = element;
                        while (index--) {
                            // 没有找到符合条件的父节点，就过滤掉
                            // TODO @ls: 目前这种实现不就是每次以当前节点为根向上寻找，下面的fixme是想改成什么样呢？还是已经失效了？
                            // FIXME 以当前节点作为根节点
                            node = node.__parentSelect(items[index]);
                            if (node === null) {
                                //没有找到选择器指定的父节点
                                return;
                            }
                        }
                        //在当前文档能找到符合条件的父节点，添加进结果集
                        results.push(element);
                    });
                });
            }
            return results;
        },
        querySelectorAll: function (selector) {
            return this.__select(selector);
        },
        /*
        querySelector: function (selector) {
            var func = getSelectorFunction(selector);
            var ret = [];
            func(this, ret, 1);
            return ret;
        },
        querySelectorAll: function (selector, __results__) {
            __results__ = __results__ || [];
            var match = rquickExpr.exec(selector);
            var m;

            //assert(match !== null, "现在只支持简单的选择器: #id .class tag");
            if (match !== null) {
                if ((m = match[1])) {
                    // ID selector
                    push.apply(__results__, this.getElementById(m));
                } else if (match[2]) {
                    // Type selector
                    push.apply(__results__, this.getElementsByTagName(selector));
                } else if (m = match[3]) {
                    // Class selector
                    push.apply(__results__, this.getElementsByTagName(selector));
                }
            } else {

            }

            return __results__;
        },
       */
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
        },
        getAttribute: function (name) {
            return this[name];
        },
        dispatchEvent: function (event) {
            //console.log(this.__native_tag__ + ":[" + this.tagName + "]" + event.type);
            var ret;
            ret = this._super(event);
            if (!event.propagationStoped && this.parentNode !== null) {
                ret = this.parentNode.dispatchEvent(event);
            }
            return ret;
        }
    });

    // Easily-parseable/retrievable ID or TAG or CLASS selectors
    var rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;

    module.exports = Element;
});
