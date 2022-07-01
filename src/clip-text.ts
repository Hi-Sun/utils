const getByteLength = (str: string) => {
  const reg = new RegExp('[^\x00-\xff]', 'g');
  return str.replace(reg, '**').length;
};

// 根据字节长度截取字符串
const clipText = (text = '', len: number, fillText: string) => {
  // 获取当前字符串的字节长度
  const byteLen = getByteLength(text);

  // 不足规定截取的字节时直接返回
  if (byteLen < len) {
    return text;
  }

  let curtLen = 0;
  let returnStr = '';
  for (let i = 0; i < text.length; i++) {
    const item = text.charAt(i);
    const addLen = getByteLength(item);
    if (curtLen + addLen <= len) {
      returnStr += item;
      curtLen += addLen;
    } else {
      if (fillText) {
        const fillTextLen = getByteLength(fillText);
        for (let j = 1; j < returnStr.length; j++) {
          const lastStr = returnStr.slice(-j, returnStr.length);
          if (getByteLength(lastStr) >= fillTextLen) {
            return `${returnStr.slice(0, -j)}${fillText}`;
          }
        }
      }
      return returnStr;
    }
  }
  return returnStr;
};

export { getByteLength, clipText };
