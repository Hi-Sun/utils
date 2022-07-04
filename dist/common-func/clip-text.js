"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clipText = exports.getByteLength = void 0;
var getByteLength = function (str) {
    var reg = new RegExp('[^\x00-\xff]', 'g');
    return str.replace(reg, '**').length;
};
exports.getByteLength = getByteLength;
// 根据字节长度截取字符串
var clipText = function (text, len, fillText) {
    if (text === void 0) { text = ''; }
    // 获取当前字符串的字节长度
    var byteLen = getByteLength(text);
    // 不足规定截取的字节时直接返回
    if (byteLen < len) {
        return text;
    }
    var curtLen = 0;
    var returnStr = '';
    for (var i = 0; i < text.length; i++) {
        var item = text.charAt(i);
        var addLen = getByteLength(item);
        if (curtLen + addLen <= len) {
            returnStr += item;
            curtLen += addLen;
        }
        else {
            if (fillText) {
                var fillTextLen = getByteLength(fillText);
                for (var j = 1; j < returnStr.length; j++) {
                    var lastStr = returnStr.slice(-j, returnStr.length);
                    if (getByteLength(lastStr) >= fillTextLen) {
                        return "" + returnStr.slice(0, -j) + fillText;
                    }
                }
            }
            return returnStr;
        }
    }
    return returnStr;
};
exports.clipText = clipText;
