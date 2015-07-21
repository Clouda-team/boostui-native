define(function (require, exports, module) {
    "use strict";

    function trim(str) {
        return str == null ? "" : String.prototype.trim.call(str);
    }
    module.exports = trim;

});
