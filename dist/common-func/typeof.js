"use strict";
/**
 * 类型检测
 * 只做了常规的类型检测，如有遗漏可参考 lodash 的实现进行补充
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMediaError = exports.isDOMException = exports.isDOMError = exports.isErrorEvent = exports.isError = exports.isSyntheticEvent = exports.isEvent = exports.isFormData = exports.isBlob = exports.isArrayBuffer = exports.isElement = exports.isURLObject = exports.isDate = exports.isRegExp = exports.isThenable = exports.isFunction = exports.isLengthArray = exports.isArray = exports.isPlainObject = exports.isObjectLike = exports.isObject = exports.isPrimitive = exports.isSymbol = exports.isString = exports.isBigInt = exports.isNumber = exports.isBoolean = exports.isUndefined = exports.isNull = void 0;
// const MAX_SAFE_INTEGER = 9007199254740991;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = Object.prototype.toString;
function toObjectString(value) {
    return nativeObjectToString.call(value);
}
/**
 * 原始数据类型 (Undefined, Null, Boolean, Number, BigInt, String, Symbol)
 *
 * 参考：
 *  - https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive
 *  - https://developer.mozilla.org/en-US/docs/Glossary/Primitive
 */
function isPrimitive(value) {
    var type = typeof value;
    return value === null || (type !== 'object' && type !== 'function');
}
exports.isPrimitive = isPrimitive;
function isUndefined(value) {
    return value === undefined;
    // return typeof value === 'undefined';
}
exports.isUndefined = isUndefined;
function isNull(value) {
    return value === null;
}
exports.isNull = isNull;
function isBoolean(value) {
    return (value === true ||
        value === false ||
        (isObjectLike(value) && toObjectString(value) === '[object Boolean]'));
}
exports.isBoolean = isBoolean;
function isNumber(value) {
    return (typeof value === 'number' ||
        (isObjectLike(value) && toObjectString(value) === '[object Number]'));
}
exports.isNumber = isNumber;
// function isNaN(value: any): boolean {
//   return isNumber(value) && value !== +value;
// }
function isBigInt(value) {
    // eslint-disable-next-line
    return (typeof value === 'bigint' ||
        (isObjectLike(value) && toObjectString(value) === '[object BigInt]'));
}
exports.isBigInt = isBigInt;
function isString(value) {
    return (typeof value === 'string' ||
        (isObjectLike(value) && toObjectString(value) === '[object String]'));
}
exports.isString = isString;
function isSymbol(value) {
    return (typeof value === 'symbol' ||
        (isObjectLike(value) && toObjectString(value) === '[object Symbol]'));
}
exports.isSymbol = isSymbol;
/**
 * 引用数据类型 (Object, Array, Function, RegExp 等)
 */
function isObject(value) {
    var type = typeof value;
    return (type === 'object' || type === 'function') && value !== null;
}
exports.isObject = isObject;
function isObjectLike(value) {
    return typeof value === 'object' && value !== null;
}
exports.isObjectLike = isObjectLike;
function isPlainObject(value) {
    return toObjectString(value) === '[object Object]';
}
exports.isPlainObject = isPlainObject;
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;
// function isArrayLike(value: any): boolean {
//   return value != null && isLength(value.length) && !isFunction(value);
// }
// 有长度的数组
function isLengthArray(value) {
    return isArray(value) && value.length;
}
exports.isLengthArray = isLengthArray;
// function isLength(value: any): boolean {
//   return typeof value === 'number' && value > -1 && value % 1 === 0 && value <= MAX_SAFE_INTEGER;
// }
function isFunction(value) {
    // return typeof value === 'function';
    if (!isObject(value)) {
        return false;
    }
    var tag = toObjectString(value);
    return (tag === '[object Function]' ||
        tag === '[object GeneratorFunction]' ||
        tag === '[object AsyncFunction]' ||
        tag === '[object Proxy]');
}
exports.isFunction = isFunction;
function isThenable(value) {
    return isObjectLike(value) && toObjectString(value.then) === '[object Function]';
}
exports.isThenable = isThenable;
function isRegExp(value) {
    return isObjectLike(value) && toObjectString(value) === '[object RegExp]';
}
exports.isRegExp = isRegExp;
function isDate(value) {
    return isObjectLike(value) && toObjectString(value) === '[object Date]';
}
exports.isDate = isDate;
function isURLObject(value) {
    return isObjectLike(value) && toObjectString(value) === '[object URL]';
}
exports.isURLObject = isURLObject;
function isElement(value) {
    return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
}
exports.isElement = isElement;
function isArrayBuffer(value) {
    return isObjectLike(value) && toObjectString(value) === '[object ArrayBuffer]';
}
exports.isArrayBuffer = isArrayBuffer;
function isBlob(value) {
    return isObjectLike(value) && toObjectString(value) === '[object Blob]';
}
exports.isBlob = isBlob;
function isFormData(value) {
    return isObjectLike(value) && toObjectString(value) === '[object FormData]';
}
exports.isFormData = isFormData;
function isEvent(value) {
    return value instanceof Event;
}
exports.isEvent = isEvent;
// React 合成事件，参考：https://zh-hans.reactjs.org/docs/events.html
function isSyntheticEvent(value) {
    return isObjectLike(value) && isEvent(value.nativeEvent);
}
exports.isSyntheticEvent = isSyntheticEvent;
/**
 * 对错误、异常的判断，与 Sentry 保持一致
 */
function isError(value) {
    if (!isObjectLike(value)) {
        return false;
    }
    var tag = toObjectString(value);
    return (tag === '[object Error]' ||
        tag === '[object Exception]' ||
        tag === '[object DOMException]' ||
        value instanceof Error);
}
exports.isError = isError;
function isErrorEvent(value) {
    return toObjectString(value) === '[object ErrorEvent]';
}
exports.isErrorEvent = isErrorEvent;
function isDOMError(value) {
    return toObjectString(value) === '[object DOMError]';
}
exports.isDOMError = isDOMError;
function isDOMException(value) {
    return toObjectString(value) === '[object DOMException]';
}
exports.isDOMException = isDOMException;
function isMediaError(value) {
    return toObjectString(value) === '[object MediaError]';
}
exports.isMediaError = isMediaError;
