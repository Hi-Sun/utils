import { callAppPromise } from '../bridge';
// import { TAdkData, TAdkRes, TAdkBroadcastItem } from '../types';
import { isPlainObject, isString } from '../utils/typeof';
import dsn from './dsn';

const EMPTY_RES: TAdkRes = {
  code: '-2',
  msg: '禁止广播空数据',
};

const broadcast = (data: TAdkBroadcastItem | Array<TAdkBroadcastItem>) => {
  // 数据拼装
  const list: object[] = [];
  const pushData = (itemData: TAdkBroadcastItem) =>
    isPlainObject(itemData) &&
    isString(itemData.key) &&
    itemData.key &&
    list.push({
      ...itemData,
      dsn,
    });
  if (Array.isArray(data)) {
    data.forEach((item) => pushData(item));
  } else {
    pushData(data);
  }

  // 发送
  return list.length
    ? callAppPromise('broadcast', { list }).then(
        data => Promise.resolve(data as TAdkData),
        res => {
          // const { code, msg } = err;
          console.warn('broadcast failed', list);
          // reportError(err, {
          //   msg: `appBridge 广播异常，#${code} ${msg}`,
          //   group: ['utils/appBridge', 'callApp.broadcast', '' + code + msg],
          //   level: 'error',
          // });
          return Promise.reject(res as TAdkRes);
        }
      )
    : Promise.reject(EMPTY_RES);
};

export { broadcast };
