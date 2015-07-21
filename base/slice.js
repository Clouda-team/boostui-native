define(function (require, exports, module) {
    "use strict";

    /**
     * slice 把数组中一部分的浅复制存入一个新的数组对象中，并返回这个新的数组。
     *
     * @param {Array} array 数组
     * @param {Number} start 开始索引
     * @param {Number} end 结束索引
     * @access public
     * @return {Array} 被截取后的数组
     */

    var _slice = Array.prototype.slice;

    function slice(array, start, end) {
        switch (arguments.length) {
        case 0:
            //TODO throw Error???
            return [];
        case 1:
            return _slice.call(array);
        case 2:
            return _slice.call(array, start);
            // case 3:
        default:
            return _slice.call(array, start, end);
        }
    }

    module.exports = slice;

});
