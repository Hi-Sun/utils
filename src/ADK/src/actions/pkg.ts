import { callAppPromise } from '../bridge';
// import { TAdkCallOptions } from '../types';
import debounce from './debounce';

const actions = {
  request(options: TAdkCallOptions) {
    return callAppPromise('request', options);
  },
  checkPkg(options: TAdkCallOptions) {
    return callAppPromise('checkPkg', options);
  },
  loadPkg: debounce((options: TAdkCallOptions) => {
    return callAppPromise('loadPkg', options);
  }),
  // removePkg: debounce((options: TAdkCallOptions) => {
  //   return callAppPromise('removePkg', options);
  // }),
};

export default actions;
