define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var Event = require("boost/Event");

    var PropertyChangeEvent = derive(Event, function (target, key, value, origValue) {
        this._super(target, "propertychange");
        this.__key__ = key;
        this.__value__ = value;
        this.__orig__ = origValue;
    }, {

        "get key": function () {
            return this.__key__;
        },

        "get value": function () {
            return this.__value__;
        },

        "get origValue": function () {
            return this.__orig__;
        }
    });

    module.exports = PropertyChangeEvent;
});
