define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");

    var Event = derive(Object, function (target, type) {
        this.__target__ = target;
        this.__type__ = type;
        this.__defaultPrevented__ = false;
        this.__propagationStopped__ = false;
    }, {
        "get target": function () {
            return this.__target__;
        },
        "get type": function () {
            return this.__type__;
        },
        preventDefault: function () {
            this.__defaultPrevented__ = true;
        },
        isDefaultPrevented: function () {
            return this.__defaultPrevented__;
        },
        stopPropagation: function () {
            this.__propagationStopped__ = true;
        },
        isPropagationStopped: function () {
            return this.__propagationStopped__;
        }
    });

    module.exports = Event;

});
