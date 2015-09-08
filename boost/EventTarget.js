define(function (require, exports, module) {
    "use strict";


    var derive = require("base/derive");
    var assert = require("base/assert");
    var type = require("base/type");
    var hasOwnProperty = require("base/hasOwnProperty");

    var EventTarget = derive(Object, function () {
        this.__listeners__ = {};
    }, {
        addEventListener: function (eventType, listener, useCapture) {
            var listeners = this.__listeners__;
            if (!hasOwnProperty(listeners, eventType)) {
                listeners[eventType] = [];
            }

            assert(type(listeners[eventType]) === "array", "__listeners__ is not an array");

            //TODO useCapture
            listeners[eventType].push(listener);
            return true;
        },

        removeEventListener: function (eventType, listener, useCapture) {
            var listeners = this.__listeners__;
            var index;
            var found;
            if (!hasOwnProperty(listeners, eventType)) {
                return false;
            }

            found = false;
            //TODO useCapture
            while ((index = listeners[eventType].indexOf(listener)) > -1) {
                listeners[eventType].splice(index, 1);
                found = true;
            }
            return found;
        },

        removeAllEventListeners: function () {
            this.__listeners__ = {};
        },

        dispatchEvent: function (event) {
            var type = event.type;
            var listeners = this.__listeners__;
            if (hasOwnProperty(listeners, type)) {
                return listeners[type].forEach(function (listener) {
                    listener.call(this, event);
                }, this);
            }
            return !event.defaultPrevented;
        }
    });

    module.exports = EventTarget;

});
