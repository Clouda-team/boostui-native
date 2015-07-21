define(function (require, exports, module) {
    "use strict";
    /**
     * type 判断对象类型函数
     * 从 jquery 中拷贝来的
     *
     * @param {Object} obj 被鉴定的对象
     * @access public
     * @return {String} 对象类型字符串
     */
    var types = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object"],
        toString = Object.prototype.toString,
        class2type = {},
        count, name;

    //构造 class2type 表
    //{
    //  "[object Object]"   : "object",
    //  "[object RegExp]"   : "regexp",
    //  "[object Date]"     : "date",
    //  "[object Array]"    : "array",
    //  "[object Function]" : "function",
    //  "[object String]"   : "string",
    //  "[object Number]"   : "number",
    //  "[object Boolean]"  : "boolean"
    //}
    count = types.length;
    while (count--) {
        name = types[count];
        class2type["[object " + name + "]"] = name.toLowerCase();
    }

    function type(obj) {
        return obj == null ?
            String(obj) :
            class2type[toString.call(obj)] || "object";
    }

    module.exports = type;

});
