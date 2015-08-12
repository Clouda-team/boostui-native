define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var Animation = require("boost/Animation");

    //var NATIVE_ANIMATION_TYPE = "WrappedAlphaAnimation";
    var NATIVE_ANIMATION_TYPE = 0;

    var AlphaAnimation = derive(Animation, function (fromValue, toValue, duration) {
        var config = {
            duration: duration,
            fromValue: fromValue,
            toValue: toValue
        };
        Animation.call(this, NATIVE_ANIMATION_TYPE, config);
    });
    module.exports = AlphaAnimation;
});
