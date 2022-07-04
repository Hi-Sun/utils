import adaptBroadcastData from '../adapters/adaptBroadcastData';
// import { TAdkData, TAdkHandler, TAdkBroadcastItem } from '../types';
import { isPlainObject, isLengthArray, isString } from '../utils/typeof';
import EventEmitter from '../utils/EventEmitter';
import dsn from './dsn';

const broadcastEvent = new EventEmitter();
const onBroadcast = (key: string, handler: TAdkHandler) => broadcastEvent.on(key, handler);
const offBroadcast = (key: string, handler?: TAdkHandler) => broadcastEvent.off(key, handler);
const onceBroadcast = (key: string, handler: TAdkHandler) => broadcastEvent.once(key, handler);
const _handleBroadcast = (data: TAdkData = {}) => {
  const { list } = data;
  isLengthArray(list) && list.forEach((item: TAdkBroadcastItem) => {
    if (isPlainObject(item) && isString(item.key) && item.dsn !== dsn) {
      const { key, data } = item;
      broadcastEvent.emit(key, adaptBroadcastData(key, data));
    }
  });
};

export { onBroadcast, offBroadcast, onceBroadcast, _handleBroadcast };
