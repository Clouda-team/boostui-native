define(function (require, exports, module) {"use strict";

var hasOwnProperty = require("base/hasOwnProperty");

var tagMap = {};
var tagId = 0;

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
    return "$__tag_" + tagId++ + "__$";
}

module.exports = {
    get: get,
    set: set,
    remove: remove,
    genTag: genTag
};

});
