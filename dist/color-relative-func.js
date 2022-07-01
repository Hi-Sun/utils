"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRGBA = void 0;
exports.parseRGBA = function (val) {
    var _a;
    var argb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val) || {};
    var color = {
        r: parseInt(argb === null || argb === void 0 ? void 0 : argb[1], 16),
        g: parseInt(argb === null || argb === void 0 ? void 0 : argb[2], 16),
        b: parseInt(argb === null || argb === void 0 ? void 0 : argb[3], 16),
        a: parseInt(argb === null || argb === void 0 ? void 0 : argb[4], 16) / 255,
    };
    return "rgba(" + (color === null || color === void 0 ? void 0 : color.r) + ", " + color.g + ", " + color.b + ", " + ((_a = color === null || color === void 0 ? void 0 : color.a) === null || _a === void 0 ? void 0 : _a.toFixed(1)) + ")";
};
