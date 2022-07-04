import { callAppPromise } from '../bridge';
// import { TAdkCallOptions } from '../types';
import debounce from './debounce';

const actions = {
  canIUse(options: TAdkCallOptions) {
    return callAppPromise('canIUse', options);
  },
  requestAuthorization(options: TAdkCallOptions) {
    return callAppPromise('requestAuthorization', options);
  },
  pickImage: debounce((options: TAdkCallOptions) => {
    return callAppPromise('pickImage', options);
  }),
  saveImage: debounce((options: TAdkCallOptions) => {
    return callAppPromise('saveImage', options);
  }),
};

export default actions;
