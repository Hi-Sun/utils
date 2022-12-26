// 整数判断

/**
 * 原理：任意整数可被1整除
 */
function isInteger1(num: any) {
  return typeof num === 'number' && num % 1 === 0
}
/**
 * 原理：整数取整后还是等于自己
 * Math.floor:向下取整 ｜ Math.ceil:向上取整 ｜ Math.round:四舍五入取整
 */
function isInteger2(num: any) {
  return Math.floor(num) === num || Math.round(num) === num || Math.ceil(num) === num
}

/**
 * ES6 提供Number整数判断方法isInteger
 */
 function isInteger3(num: any) {
  return Number.isInteger(num)
}