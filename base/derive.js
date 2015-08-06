define(function (require, exports, module) {
    "use strict";

    /**
     * Js 派生实现
     *
     * @param {Function} parent 父类
     * @param {Function} [constructor]  子类构造函数
     * @param {Object} [proto] 子类原型
     * @access public
     * @return {Function} 新的类
     *
     * @example
     *
     * var ClassA = derive(Object, function(__super){
     *      console.log("I'm an instance of ClassA:", this instanceof ClassA);
     * });
     *
     * var ClassB = derive(ClassA, function(__super){
     *      console.log("I'm an instance of ClassB:", this instanceof ClassB);
     *      __super();
     * }, {
     *      test:function(){
     *          console.log("test method!");
     *      }
     * });
     *
     * var b = new ClassB();
     * //I'm an instance of ClassA: true
     * //I'm an instance of ClassA: true
     * b.test();
     * //test method!
     */

    var isFunction = require("base/isFunction");
    var copyProperties = require("base/copyProperties");
    var each = require("base/each");
    var hasOwnProperty = require("base/hasOwnProperty");

    function bindSuper(fn, superFn) {
        //return fn;

        if (!isFunction(superFn)) {
            superFn = throwNoSuper;
        }

        return function () {
            var returnValue;
            var _super = this._super;
            this._super = superFn;
            //try {
            returnValue = fn.apply(this, arguments);
            //} finally {
            this._super = _super;
            //}
            return returnValue;
        };
    }

    function throwNoSuper() {
        throw new Error("this._super is not a function.");
    }

    function derive(parent, constructor, proto) {

        //如果没有传 constructor 参数
        if (typeof constructor === 'object') {
            proto = constructor;
            constructor = hasOwnProperty(proto, "constructor") ?
                proto.constructor :
                function () {
                    //this._super.apply(this, arguments);
                    parent.apply(this, arguments);
                };
            delete proto.constructor;
        }

        var //tmp = function () {},
        //子类构造函数
        //subClass = bindSuper(constructor, parent),
            subClass = constructor,
            subClassPrototype,
            key, value,
            parts, modifier, properties, property;

        //原型链桥接
        //tmp.prototype = parent.prototype;
        //subClassPrototype = new tmp();
        subClassPrototype = Object.create(parent.prototype);
        proto = proto || {};


        //复制属性到子类的原型链上
        //copyProperties(
        //    subClassPrototype,
        //    constructor.prototype
        //);
        //subClassPrototype.constructor = constructor.prototype.constructor;

        properties = {};
        each(proto, function (value, key) {
            parts = key.split(" ");
            if (parts.length === 1) {
                //if (isFunction(value)) {
                //subClassPrototype[key] = bindSuper(value, parent.prototype[key]);
                //} else {
                subClassPrototype[key] = value;
                //}
            } else {
                modifier = parts.shift();
                key = parts.join(" ");
                switch (modifier) {
                case "get":
                case "set":
                    property = properties[key] || {};
                    property[modifier] = value;
                    properties[key] = property;
                    break;
                default:
                    //TODO
                }
            }
        });
        Object.defineProperties(subClassPrototype, properties);

        //each(properties, function (conf, name) {
        //    Object.defineProperty(subClassPrototype, name, conf);
        //});

        subClass.prototype = subClassPrototype;
        subClassPrototype.constructor = subClass;
        return subClass;
    }

    module.exports = derive;
    //});

});
