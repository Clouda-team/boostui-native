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
         * 由web与boost在合适时机设值、取消值
         */
        doNotUpdateWeb: false, //web改boost同步即触发，改完即可直接置回false（如果交给boost中置回，则入口太多，容易出错）
        doNotUpdateBoostOnce: false, //boost改web时，web中observer回调非同步触发，故只能web中置回，好在入口只有一处，容易把控

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
        //TODO: 有些样式没有更新至dom上，比如follow的颜色、测试按钮的背景色
        isActive: function () {
            return this._active;
        }
    });

    module.exports = new WebDebugger();
});
