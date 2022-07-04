import { callAppPromise } from '../bridge';
import proxy from '../proxy';
// import { TAdkCallOptions } from '../types';
import { networkPolicy } from '../utils/client';
import { isNumber } from '../utils/typeof';
import debounce from './debounce';

let lastNetworkPolicy: number | null = networkPolicy;

const actions = {
  setWebView(options: TAdkCallOptions) {
    if (isNumber(options.networkPolicy) && options.networkPolicy !== lastNetworkPolicy) {
      if (options.networkPolicy === 1) {
        lastNetworkPolicy = 1;
        proxy.enableProxy();
      } else if (options.networkPolicy === 0) {
        const { success } = options;
        options.success = data => {
          lastNetworkPolicy = 0;
          proxy.disableProxy();
          success && success.call(success, data);
        };
      }
    }
    return callAppPromise('setWebView', options);
  },
  showToast(options: TAdkCallOptions) {
    return callAppPromise('showToast', options);
  },
  showDialog: debounce((options: TAdkCallOptions) => {
    return callAppPromise('showDialog', options);
  }),
  showActionSheet: debounce((options: TAdkCallOptions) => {
    return callAppPromise('showActionSheet', options);
  }),
  viewImage: debounce((options: TAdkCallOptions) => {
    return callAppPromise('viewImage', options);
  }),
};

export default actions;
