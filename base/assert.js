define(function (require, exports, module) {
    "use strict";

    function assert(condition, msg) {
        if (condition !== true) {
            throw new Error(msg || "assert failed.");
        }
    }
    module.exports = assert;

});
