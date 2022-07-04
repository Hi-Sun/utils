import { callAppPromise } from '../bridge';
// import { TAdkCallOptions } from '../types';
import ability from './ability';
import location from './location';
import navigation from './navigation';
import pkg from './pkg';
import storage from './storage';
import ui from './ui';
import user from './user';
import debounce from './debounce';

const actions = {
  ...ability,
  ...location,
  ...navigation,
  ...pkg,
  ...storage,
  ...ui,
  ...user,

  getAppInfo(options?: TAdkCallOptions) {
    return callAppPromise('getAppInfo', options);
  },
  setApp(options?: TAdkCallOptions) {
    return callAppPromise('setApp', options);
  },
  share: debounce((options: TAdkCallOptions) => {
    return callAppPromise('share', options);
  }),
  downloadApp: debounce((options: TAdkCallOptions) => {
    return callAppPromise('downloadApp', options);
  }),
};

export default actions;
