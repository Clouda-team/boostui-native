define(function (require, exports, module) {
    "use strict";
    var derive = require("base/derive");
    var each = require("base/each");
    var hasOwnProperty = require("base/hasOwnProperty");
    var assert = require("base/assert");
    var Element = require("boost/Element");
    var EventTarget = require("boost/EventTarget");
    var NativeElement = require("boost/NativeElement");
    var View = require("boost/View");
    var Text = require("boost/Text");
    var TextInput = require("boost/TextInput");
    var Image = require("boost/Image");
    var ScrollView = require("boost/ScrollView");
    var Slider = require("boost/Slider");

    var ROOT_ELEMENT_TAG = "tag_nativeview";
    var TAG_MAP = {
        "View": View,
        "Text": Text,
        "TextInput": TextInput,
        "Image": Image,
        "ScrollView": ScrollView,
        "Slider": Slider,
    };

    var documentProto = {
        constructor: function () {
            this._super();
            this.__tagMap__ = {};
            this.__docuemntElement__ = null;
        },
        "get documentElement": function () {
            if (this.__docuemntElement__ === null) {
                this.__docuemntElement__ = NativeElement.__rootElement;
            }
            return this.__docuemntElement__;
        },
        createElement: function (tagName) {
            tagName = tagName.toUpperCase();
            assert(hasOwnProperty(this.__tagMap__, tagName), "unknow tag \"" + tagName + "\"");
            return new this.__tagMap__[tagName]();
        },
        registerElement: function (tagName, options) {
            var constructor;
            if (options.constructor) {
                constructor = options.constructor;
            } else {
                constructor = Element;
            }

            this.__tagMap__[tagName.toUpperCase()] = constructor;
        }
    };

    function bridgeDocumentElement(obj, method) {
        obj[method] = function () {
            var documentElement = this.documentElement;
            return documentElement[method].apply(documentElement, arguments);
        };
    }

    bridgeDocumentElement(documentProto, "getElementById");
    bridgeDocumentElement(documentProto, "getElementsByClassName");
    bridgeDocumentElement(documentProto, "getElementsByTagName");
    bridgeDocumentElement(documentProto, "querySelector");
    bridgeDocumentElement(documentProto, "querySelectorAll");

    var BoostDocument = derive(EventTarget, documentProto);
    var boost = new BoostDocument();

    each(TAG_MAP, function (constructor, tagName) {
        boost.registerElement(tagName, {
            constructor: constructor
        });
    });

    module.exports = boost;

});
