// import { TAdkData } from '../types';
import adaptLocationData from '../adapters/adaptLocationData';
import adaptUserData from '../adapters/adaptUserData';

const dataAdapters: TAdkData = {
  'user/login': adaptUserData,
  'bizLocation.update': adaptLocationData,
};

const adaptBroadcastData = (key: string, data?: TAdkData) => {
  const adapter = dataAdapters[key];
  return adapter ? adapter(data) : data;
};

export default adaptBroadcastData;
