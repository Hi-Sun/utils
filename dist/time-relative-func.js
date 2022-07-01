"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeNow = exports.initTime = exports.dateFormat = void 0;
exports.dateFormat = function (date, def) {
    if (/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(date)) {
        return date;
    }
    if (/^[1-9]\d{3}(年)(0[1-9]|1[0-2])(月)(0[1-9]|[1-2][0-9]|3[0-1])(日)*$/.test(date)) {
        return date.replace('年', '-').replace('月', '-').replace('日', '');
    }
    if (date && parseInt(date) !== 0) {
        if (/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/.test(date)) {
            date = new Date(date);
        }
        return moment(date, 'yyyy-MM-dd');
        // return moment(parseInt(date)).utcOffset(480).format('YYYY-MM-DD');
    }
    return def || ' ';
};
exports.initTime = function (date, def, type) {
    if (def === void 0) { def = '-'; }
    if (type === void 0) { type = 'yyyy-MM-dd'; }
    if (!date) {
        return def;
    }
    if (/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(date)) {
        return date;
    }
    if (/^[1-9]\d{3}(年|\.)(0[1-9]|1[0-2])(月|\.)(0[1-9]|[1-2][0-9]|3[0-1])(日)*$/.test(date)) {
        return date.replace('年', '-').replace('月', '-').replace('日', '').replace(/\./g, '-');
    }
    if (date && parseInt(date) !== 0) {
        if (/^[1-9]\d{3}(-|\/)(0[1-9]|1[0-2])(-|\/)(0[1-9]|[1-2][0-9]|3[0-1])/.test(date)) {
            date = new Date(date);
        }
        return relaxDateFormat(date, type);
        // return moment(parseInt(date)).utcOffset(480).format(type);
    }
    return def || '-';
};
exports.getTimeNow = function () {
    return new Date().getTime();
};
