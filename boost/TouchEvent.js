define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var Event = require("boost/Event");

    var TouchEvent = derive(Event, function (target, type, x, y) {
        //this._super(target, type);
        Event.call(this, target, type);
        this.__x__ = x;
        this.__y__ = y;
    }, {

        "get x": function () {
            return this.__x__;
        },

        "get y": function () {
            return this.__y__;
        }
    });

    module.exports = TouchEvent;
});
