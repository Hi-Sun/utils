"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportSentryMsg = void 0;
var Sentry = __importStar(require("@sentry/nextjs"));
var typeof_1 = require("./typeof");
var MSG_PREFIX = '® ';
var MEDIA_ERROR_NAMES = [
    '',
    'MEDIA_ERR_ABORTED',
    'MEDIA_ERR_NETWORK',
    'MEDIA_ERR_DECODE',
    'MEDIA_ERR_SRC_NOT_SUPPORTED',
];
/**
 * 上报异常到 Sentry
 * @param {*} e - 异常信息，格式可以是 error、string、json object
 * @param {(object, string)=} options - 附加文案，或以下参数
 * @param {string=} options.message - 附加文案
 * @param {object=} options.data - 附加数据
 * @param {string=} options.level - 异常级别，可选值：'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug' | 'critical'
 * @param {array<string>=} options.group - 分组信息
 *
 * @example
 *   reportSentry(e);
 *   reportSentry(e, '附加文案');
 *   reportSentry(e, {
 *     message: '附加文案',
 *     data: { k: 'v' },
 *     level: 'info',
 *     group: ['Label 1', 'Label 2', '...'],
 *   });
 *   reportSentry('附加文案');
 *   reportSentry('上报文案', { level: 'error' });
 *   reportSentry({code: 500, message: '附加文案'});
 */
var reportSentry = function (e, options) {
    var _a = typeof_1.isPlainObject(options)
        ? options
        : typeof_1.isString(options)
            ? { message: options }
            : {}, _b = _a.message, message = _b === void 0 ? '' : _b, _c = _a.data, data = _c === void 0 ? null : _c, _d = _a.level, level = _d === void 0 ? Sentry.Severity.Warning : _d, _e = _a.group, group = _e === void 0 ? [] : _e;
    try {
        // Add data, message to Breadcrumbs
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/enriching-events/breadcrumbs/
        data &&
            Sentry.addBreadcrumb({
                data: data,
                level: level,
            });
        message &&
            Sentry.addBreadcrumb({
                message: message,
                level: level,
            });
        Sentry.withScope(function (scope) {
            // Levels: 'fatal', 'error', 'warning', 'log', 'info', 'debug', 'critical'.
            // https://docs.sentry.io/platforms/javascript/guides/nextjs/usage/set-level/
            scope.setLevel(level);
            // Group errors into issues.
            // https://docs.sentry.io/platforms/javascript/guides/nextjs/usage/sdk-fingerprinting/
            scope.setFingerprint(__spreadArrays((typeof_1.isArray(group) && group.length
                ? group
                : [
                    (typeof_1.isObjectLike(e) ? String(e.message || e.msg || '') : String(e)) + message ||
                        '{{ default }}',
                ]), [
                level,
            ]));
            var defaultMessage = message || '未知异常';
            var exception;
            switch (true) {
                case typeof_1.isError(e):
                case typeof_1.isErrorEvent(e) && e.error:
                case typeof_1.isDOMError(e):
                case typeof_1.isDOMException(e):
                    exception = e;
                    break;
                case typeof_1.isMediaError(e):
                    // https://developer.mozilla.org/en-US/docs/Web/API/MediaError
                    exception = new Error("MediaError: #" + e.code + " " + MEDIA_ERROR_NAMES[e.code || 0] + ", " + (e.message || defaultMessage));
                    break;
                case typeof_1.isString(e):
                    if ([
                        Sentry.Severity.Log,
                        Sentry.Severity.Info,
                        Sentry.Severity.Debug,
                        Sentry.Severity.Warning,
                    ].includes(level)) {
                        Sentry.captureMessage(MSG_PREFIX + (e || defaultMessage), level);
                        return;
                    }
                    exception = new Error(e);
                    break;
                case typeof_1.isPlainObject(e):
                    Sentry.addBreadcrumb({
                        data: e,
                        level: level,
                    });
                    exception = new Error(e.message || e.msg || defaultMessage);
                    break;
                default:
                    console.warn(e);
                    exception = new Error(String(e) || defaultMessage);
                // TODO:
                // Sentry.captureEvent({
                //   message: 'Manual',
                //   stacktrace: [
                //     // ...
                //   ],
                // });
            }
            try {
                exception.name = MSG_PREFIX + exception.name;
            }
            catch (err) {
                // do nothing
            }
            Sentry.captureException(exception);
            exception = null;
        });
    }
    catch (err) {
        // do nothing
    }
};
var reportSentryMsg = Sentry.captureMessage;
exports.reportSentryMsg = reportSentryMsg;
exports.default = reportSentry;
