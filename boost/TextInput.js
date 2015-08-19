define(function (require, exports, module) {
    "use strict";

    var derive = require("base/derive");
    var NativeElement = require("boost/NativeElement");
    var TextStylePropTypes = require("boost/TextStylePropTypes");
    var StyleSheet = require("boost/StyleSheet");
    var validator = require("boost/validator");
    var FocusEvent = require("boost/FocusEvent");

    //var NATIVE_VIEW_TYPE = "WrappedEditText";
    var NATIVE_VIEW_TYPE = 5;

    var TextStyle = derive(StyleSheet, TextStylePropTypes);

    var TextInput = derive(NativeElement, function () {
        //this._super(NATIVE_VIEW_TYPE, "TextInput");
        NativeElement.call(this, NATIVE_VIEW_TYPE, "TextInput");
    }, {
        __getStyle: function () {
            return new TextStyle();
        },
        __onEvent: function (type, e) {
            var event;
            switch (type) {
            case "focus":
            case "blur":
                event = new FocusEvent(this, type);
                this.dispatchEvent(event);
                break;
            case "change":
                this.__config__.value = e.text;
                break;
            default:
                console.log("unknow event:" + type, e);
            }
        },
        "get value": function () {
            return this.__config__.value || "";
        },
        "set value": function (value) {
            this.__update("value", value);
        },
        "get editable": function () {
            return this.__config__.editable || true;
        },
        "set editable": function (value) {
            this.__update("editable", validator.boolean(value));
        },
        "get multiline": function () {
            return this.__config__.multiline || true;
        },
        "set multiline": function (value) {
            this.__update("multiline", validator.boolean(value));
        },
        "get password": function () {
            return this.__config__.password || false;
        },
        "set password": function (value) {
            this.__update("password", validator.boolean(value));
        },
        "set keyboardType": function (value) {
            this.__update("keyboardType", validator.string(value));
        },
        "set numberOfLines": function (value) {
            this.__update("numberOfLines", validator.number(value));
        },
        "set placeholder": function (value) {
            this.__update("placeholder", validator.string(value));
        },
        "set placeholderTextColor": function (value) {
            this.__update("placeholderTextColor", validator.color(value));
        }
    });
    module.exports = TextInput;
});
