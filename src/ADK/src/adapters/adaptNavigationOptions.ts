// import { TAdkCallOptions } from '../types';

import getFullUrl from '../utils/getFullUrl';

// 企服原生路由
const adaptQFAppOptions = (options: TAdkCallOptions) => {
  const { routeName, params, checkLogin, ...others } = options;
  const queryArr: string[] = [];
  params && queryArr.push(`params=${encodeURIComponent(JSON.stringify(params))}`);
  checkLogin && queryArr.push(`checkLogin=${checkLogin}`);
  return {
    url: `tyqf://${routeName.trim()}` + (queryArr.length ? `?${queryArr.join('&')}` : ''),
    ...others,
  };
};

// 企服 Web
const adaptQFWebOptions = (options: TAdkCallOptions) => {
  const { url, params, checkLogin, ...others } = options;
  const queryArr: string[] = [];
  queryArr.push(`url=${encodeURIComponent(getFullUrl((url || '').trim()))}`);
  params && queryArr.push(`params=${encodeURIComponent(JSON.stringify(params))}`);
  checkLogin && queryArr.push(`checkLogin=${checkLogin}`);
  return {
    url: `tyqf://Web?${queryArr.join('&')}`,
    ...others,
  };
};

// // Business 原生路由
// const adaptBizAppOptions = (options: TAdkCallOptions) => {
//   return options;
// };

// Business Web
const adaptBizWebOptions = (options: TAdkCallOptions) => {
  const { url, ...others } = options;
  return {
    url: `tybiz://app.jindi.business/facade/web?url=${encodeURIComponent(getFullUrl(url.trim()))}`,
    ...others,
  };
};

export {
  adaptQFAppOptions,
  adaptQFWebOptions,
  // adaptBizAppOptions,
  adaptBizWebOptions,
};
