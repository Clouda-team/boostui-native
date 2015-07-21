define(function (require, exports, module) {
    "use strict";

    var genQueue = require("boost/genQueue");
    var hasOwnProperty = require("base/hasOwnProperty");
    var copyProperties = require("base/copyProperties");
    var assert = require("base/assert");

    var queue = genQueue(function (list) {
        //list = mergeQueue(list);
        console.log("callQueue(" + JSON.stringify(list, null, 2) + ")");
        //console.log("callQueue(", list, ")");
        lc_bridge.callQueue(JSON.stringify(list));

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

    var bridge = {
        call: function (tag, method, args) {
            var viewTag;
            var config;
            // 对createView、updateView 等做优化 
            if (tag === "") {
                switch (method) {
                case "createView":
                    viewTag = args[0];

                    //将 config 参数存起来,方便 update 的时候改动
                    config = copyProperties({}, args[2]);
                    createHeap[viewTag] = config;
                    args[2] = config;
                    break;

                case "updateView":

                    viewTag = args[0];

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
                    break;

                default:
                    // nothing
                }
            }

            queue.push({
                tag: tag,
                method: method,
                args: args
            });
        }
    };

    module.exports = bridge;
});
