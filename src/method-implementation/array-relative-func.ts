/**
 * 一位数组转化成二维码数组
 * @param list 列表
 * @param gItemNumber 二维数组的每个数组长度
 * @returns 二维数组
 */
 export const hotnewGroup = (list: any, gItemNumber?: number) => {
    list = list || [];
    const gItemNum = gItemNumber || 8;
  
    const len = list.length; // 假设每行显示8个
    const lineNum = len % gItemNum === 0 ? len / gItemNum : Math.floor(len / gItemNum + 1);
    const res = [];
    for (let i = 0; i < lineNum; i++) {
      // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
      const temp = list.slice(i * gItemNum, i * gItemNum + gItemNum);
      res.push(temp);
    }
    return res;
  };