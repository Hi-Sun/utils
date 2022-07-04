"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preZero = exports.getNextDayT0 = exports.getNextNDaysT0 = exports.getDateTime = exports.getHMS = exports.getYMD = void 0;
/**
 * 获取年月日字符串（本地时区）
 * @param {number | string | Date} [time] - 指定时间，格式为时间戳、时间字符串或 Date 对象。若未指定则使用本地时间。
 * @param {string} [separator] - 分隔符，默认为 `-`。
 * @returns {string} - 年月日字符串，默认格式为 `YYYY-MM-DD`。
 */
var getYMD = function (time, separator) {
    if (separator === void 0) { separator = '-'; }
    var d = time ? new Date(time) : new Date();
    return [
        d.getFullYear(),
        preZero(d.getMonth() + 1),
        preZero(d.getDate()),
    ].join(separator);
};
exports.getYMD = getYMD;
/**
 * 获取时分秒字符串（本地时区）
 * @param {number | string | Date} [time] - 指定时间，格式为时间戳、时间字符串或 Date 对象。若未指定则使用本地时间。
 * @param {string} [separator] - 分隔符，默认为 `:`。
 * @returns {string} - 时分秒字符串，默认格式为 `HH:mm:ss`。
 */
var getHMS = function (time, separator) {
    if (separator === void 0) { separator = ':'; }
    var d = time ? new Date(time) : new Date();
    return [
        preZero(d.getHours()),
        preZero(d.getMinutes()),
        preZero(d.getSeconds()),
    ].join(separator);
};
exports.getHMS = getHMS;
/**
 * 获取包含年月日周时分秒的对象（本地时区）
 * @param {number | string | Date} [time] - 指定时间，格式为时间戳、时间字符串或 Date 对象。若未指定则使用本地时间。
 * @returns {object} - 包含年月日周时分秒的对象。
 */
var getDateTime = function (time) {
    var d = time ? new Date(time) : new Date();
    return {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        date: d.getDate(),
        day: d.getDay(),
        hour: d.getHours(),
        minute: d.getMinutes(),
        second: d.getSeconds(),
    };
};
exports.getDateTime = getDateTime;
/**
 * 获取指定天数后 0 时的时间对象（本地时区）
 * @param {number} [days] - 天数，默认为 1。
 * @param {number | string | Date} [time] - 起始时间，格式为时间戳、时间字符串或 Date 对象。若未指定则使用本地时间。
 * @returns {Date} - 指定天数后 0 时的时间对象。
 */
var getNextNDaysT0 = function (days, time) {
    if (days === void 0) { days = 1; }
    var nextTime = time ? new Date(time) : new Date();
    nextTime.setDate(nextTime.getDate() + days);
    nextTime.setHours(0, 0, 0, 0);
    return nextTime;
};
exports.getNextNDaysT0 = getNextNDaysT0;
/**
 * 获取次日 0 时的时间对象（本地时区）
 * @param {number | string | Date} [time] - 起始时间，格式为时间戳、时间字符串或 Date 对象。若未指定则使用本地时间。
 * @returns {Date} - 次日 0 时的时间对象。
 */
var getNextDayT0 = function (time) {
    return getNextNDaysT0(1, time);
};
exports.getNextDayT0 = getNextDayT0;
/**
 * 在个位数前补 0
 * @param {number | string} num - 数值
 * @returns {string} - 补 0 后的字符串
 */
var preZero = function (num) {
    return (num < 10 ? '0' : '') + num;
};
exports.preZero = preZero;
