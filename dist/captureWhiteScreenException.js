"use strict";
// 捕获大盘监控到的白屏问题
// http://172.28.84.202:8888/%E6%9F%A5%E5%85%AC%E5%8F%B8264514c008f730a6.png
// Application error: a client-side exception has occurred (see the browser console for more information).
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var multiTry_1 = __importDefault(require("./multiTry"));
var reportSentry_1 = __importDefault(require("./reportSentry"));
var ERROR_KEYWORDS = 'Application error: a client-side exception has occurred';
var hasCaptured = false;
var doCapture = function () {
    return new Promise(function (resolve, reject) {
        if (hasCaptured) {
            resolve(true);
        }
        else if (window.document.body.innerText.indexOf(ERROR_KEYWORDS) >= 0) {
            reportSentry_1.default('@利霞 client-side exception has occurred', {
                level: 'fatal',
            });
            hasCaptured = true;
            resolve(true);
        }
        else {
            reject(false);
        }
    });
};
var multiCapture = function () {
    multiTry_1.default(doCapture, 2, 50).catch(function () {
        // do nothing.
    });
};
var captureWhiteScreenException = function () {
    if (typeof window !== 'undefined') {
        try {
            // 尝试在 DOMContentLoaded、load、LCP 时捕获异常
            // window.document?.addEventListener('DOMContentLoaded', multiCapture);
            window.onload = multiCapture;
            new PerformanceObserver(multiCapture).observe({
                type: 'largest-contentful-paint',
                buffered: true,
            });
        }
        catch (e) {
            // do nothing.
        }
    }
};
exports.default = captureWhiteScreenException;
