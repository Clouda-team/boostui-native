define(function (require, exports, module) {
    "use strict";

    var genQueue = require("boost/genQueue");
    var hasOwnProperty = require("base/hasOwnProperty");
    var copyProperties = require("base/copyProperties");
    var assert = require("base/assert");

    var methodList = [
        "createView",
        "updateView",
        "addView",
        "removeView",
        "createAnimation",
        "startAnimation",
        "cancelAnimation"
    ];

    var queue = genQueue(function (list) {
        var cmdStr;
        cmdStr = JSON.stringify(list);
        lc_bridge.callQueue(cmdStr);
        clearHeap();
    });
    queue.run();


    var createHeap;
    var updateHeap;

    function clearHeap() {
        createHeap = {};
        updateHeap = {};
    }

    clearHeap();

    var TAG_IDX = 0;
    var METH_IDX = 1;
    var ARGS_IDX = 2;

    var bridge = {
        call: function (tag, method, args) {
            var cmd = [];
            var viewTag;
            var config;
            var methodId;
            // 对createView、updateView 等做优化 
            if (tag === null) {
                switch (method) {
                case "createView":
                    viewTag = "_" + args[0];

                    //将 config 参数存起来,方便 update 的时候改动
                    config = copyProperties({}, args[2]);
                    createHeap[viewTag] = config;
                    args[2] = config;
                    //args[2] = {};
                    break;

                case "updateView":

                    viewTag = "_" + args[0];

                    //如果 create 堆里有需要 update 的节点,则直接更新 config
                    if (hasOwnProperty(createHeap, viewTag)) {
                        copyProperties(createHeap[viewTag], args[2]);
                        return;
                    }

                    //如果 update 堆里有需要 update 的节点,则直接更新 config
                    if (hasOwnProperty(updateHeap, viewTag)) {
                        copyProperties(updateHeap[viewTag], args[2]);
                        return;
                    }

                    //将 config 参数存起来,方便下次 update 的时候改动
                    config = copyProperties({}, args[2]);
                    updateHeap[viewTag] = config;
                    args[2] = config;
                    //args[2] = {};
                    break;

                default:
                    // nothing
                }
            }

            if (tag !== null) {
                cmd.push(tag);
            }
            methodId = methodList.indexOf(method);
            if (methodId < 0) {
                throw new Error("Native 不支持此方法或者为绑定");
            }
            cmd.push(methodId);
            cmd.push(args);
            queue.push(cmd);
        }
    };

    module.exports = bridge;
});
