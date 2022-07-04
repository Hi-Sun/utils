let options: TAdkData = {
  debug: false,  // 开发调试模式
  report: (...args: any) => console.info(...args),
};

const config = (opt: TAdkData = {}) => {
  options = Object.assign(options, opt);
};

export { options, config };
