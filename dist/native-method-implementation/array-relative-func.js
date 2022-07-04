"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotnewGroup = void 0;
/**
 * 一位数组转化成二维码数组
 * @param list 列表
 * @param gItemNumber 二维数组的每个数组长度
 * @returns 二维数组
 */
exports.hotnewGroup = function (list, gItemNumber) {
    list = list || [];
    var gItemNum = gItemNumber || 8;
    var len = list.length; // 假设每行显示8个
    var lineNum = len % gItemNum === 0 ? len / gItemNum : Math.floor(len / gItemNum + 1);
    var res = [];
    for (var i = 0; i < lineNum; i++) {
        // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
        var temp = list.slice(i * gItemNum, i * gItemNum + gItemNum);
        res.push(temp);
    }
    return res;
};
