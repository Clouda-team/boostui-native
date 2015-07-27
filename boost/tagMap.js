define(function (require, exports, module) {
    "use strict";

    var hasOwnProperty = require("base/hasOwnProperty");

    var tagMap = {};
    var tagId = 1; // tag id 从1开始,防止可能的冲突

    function get(tag) {
        if (hasOwnProperty(tagMap, tag)) {
            return tagMap[tag];
        }
        return null;
    }

    function set(tag, obj) {
        tagMap[tag] = obj;
    }

    function remove(tag) {
        if (get(tag) !== null) {
            tagMap[tag] = null;
        }
        delete tagMap[tag];
    }

    function genTag() {
        //return "$__tag_" + tagId++ + "__$";
        //return "_" + tagId++;
        return tagId++;
    }

    module.exports = {
        get: get,
        set: set,
        remove: remove,
        genTag: genTag
    };

});
