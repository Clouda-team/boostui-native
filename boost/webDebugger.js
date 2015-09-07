define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var $ = require("boost/$");
    var boost = require("boost/boost");
    var assert = require("base/assert");
    var webMonitor = require("boost/webMonitor");

    var WebDebugger = derive(Object, {
        _active: false,
        /**
         * 需在创建任何元素之前调用
         */
        active: function () {
            assert(!this._active, "web debugger already active");
            //TODO: assert no element was created before

            this._active = true;
            document.documentElement.style.visibility = 'hidden';
            webMonitor.start();
        },
        isActive: function () {
            return this._active;
        }
    });

    module.exports = new WebDebugger();
});
