define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var assert = require("base/assert");
    var Event = require("boost/Event");

    var FocusEvent = derive(Event, function (target, type) {
        assert(type === "focus" || type === "blur", "unknow focus event type:\"" + type + "\"")
        Event.call(this, target, type);
    });

    module.exports = FocusEvent;
});
