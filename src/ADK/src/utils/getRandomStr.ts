/**
 * 生成随机字符串
 * 
 * @param {Number} length 生成的随机字符串的长度
 * @param {Number} radix 字符串中可出现的字符数，取值范围 2~36
 */

const getRandomStr = (length: number = 8, radix: number = 36): string => {
  const arr = Array.from({ length }, () => ((Math.random() * radix) | 0).toString(radix));
  return arr.join('');
};

export default getRandomStr;
