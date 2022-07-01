"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var doNextTry = function (doTry, resolve, reject, maxTimes, currentTimes, minInterval) {
    doTry()
        .then(function (res) { return resolve(res); }, function (e) {
        if (currentTimes < maxTimes) {
            setTimeout(function () {
                doNextTry(doTry, resolve, reject, maxTimes, currentTimes + 1, minInterval);
            }, minInterval * (currentTimes * 2 - 1));
        }
        else {
            reject(e);
        }
    })
        .finally();
};
/**
 * 多次尝试
 * @param {function} doTry - 尝试过程，返回一个 promise
 * @param {number} maxTimes - 最多尝试次数，默认 10
 * @param {number} minInterval - 最小间隔时间，单位 ms，默认 500
 * @returns {promise} 多次尝试的结果
 */
var multiTry = function (doTry, maxTimes, minInterval) {
    if (maxTimes === void 0) { maxTimes = 10; }
    if (minInterval === void 0) { minInterval = 500; }
    return new Promise(function (resolve, reject) {
        doNextTry(doTry, resolve, reject, maxTimes, 1, minInterval);
    });
};
exports.default = multiTry;
