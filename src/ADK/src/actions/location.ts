import { callAppPromise } from '../bridge';
// import { TAdkCallOptions } from '../types';
import adaptLocationData from '../adapters/adaptLocationData';
import debounce from './debounce';

const actions = {
  getLocation: debounce((options?: TAdkCallOptions) => {
    return callAppPromise('getLocation', options);
  }),
  getBizLocation(options?: TAdkCallOptions) {
    return callAppPromise('getBizLocation', options).then(
      data => Promise.resolve(adaptLocationData(data)),
      res => Promise.reject(res)
    );
  },
  setBizLocation(options: TAdkCallOptions) {
    return callAppPromise('setBizLocation', options);
  },
};

export default actions;
