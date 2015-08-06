define(function (require, exports, module) {
    "use strict";

    function genQueue(callback) {
        var running = false;
        var waiting = false;
        var list = [];
        var timeFlag = null;
        var TIME_OUT = 1;

        function push(obj) {
            list.push(obj);
            if (running) {
                run();
            }
        }

        function run() {
            running = true;
            if (waiting) {
                return;
            }
            waiting = true;
            timeFlag = setTimeout(call, TIME_OUT);
        }

        function stop() {
            clearTimeout(timeFlag);
            waiting = false;
            running = false;
        }

        function call() {
            if (list.length > 0) {
                callback(list);
                list = [];
            }
            waiting = false;
        }

        return {
            push: push,
            run: run,
            stop: stop
        };
    }

    module.exports = genQueue;
});
