define(function (require, exports, module) {
    "use strict";

    /**
     * hasOwnProperty
     *
     * @param obj $obj
     * @param key $key
     * @access public
     * @return void
     */

    var native_hasOwnProperty = Object.prototype.hasOwnProperty;

    module.exports = function (obj, key) {
        return native_hasOwnProperty.call(obj, key);
    };

});
