// 获取文件名
const getFileName = (url: string) => {
  const name = url.substring(0, url.lastIndexOf('.'));
  return name.replaceAll(/[^0-9a-zA-Z]/g, (c) => {
      const num = c.codePointAt(0);
      return (num || 0) + '';
  })
}
// 获取.后缀名
const getFileSuffix = (url: string) => url.substring(url.lastIndexOf('.'))

export {
  getFileName,
  getFileSuffix
}