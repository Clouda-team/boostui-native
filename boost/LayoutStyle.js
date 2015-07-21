define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var LayoutPropTypes = require("boost/LayoutPropTypes");
    var StyleSheet = require("boost/StyleSheet");

    module.exports = derive(StyleSheet, LayoutPropTypes);
});
