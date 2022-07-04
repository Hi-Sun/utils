import { callAppPromise } from '../bridge';
// import { TAdkCallOptions } from '../types';
import {
  adaptQFAppOptions,
  adaptQFWebOptions,
  adaptBizWebOptions
} from '../adapters/adaptNavigationOptions';
import { isTYBizApp } from '../utils/client';
import debounce from './debounce';

const _toApp = (action: string, options: TAdkCallOptions) => {
  return callAppPromise(action, isTYBizApp ? options : adaptQFAppOptions(options));
};

const _toWeb = (action: string, options: TAdkCallOptions) => {
  return callAppPromise(action, (isTYBizApp ? adaptBizWebOptions : adaptQFWebOptions)(options));
};

const actions = {
  navigateTo: debounce((options: TAdkCallOptions) => {
    return callAppPromise('navigateTo', options);
  }),
  goToApp: debounce((options: TAdkCallOptions) => {
    return _toApp('navigateTo', options);
  }),
  goToWeb: debounce((options: TAdkCallOptions) => {
    return _toWeb('navigateTo', options);
  }),

  redirectTo: debounce((options: TAdkCallOptions) => {
    return callAppPromise('redirectTo', options);
  }),
  redirectToApp: debounce((options: TAdkCallOptions) => {
    return _toApp('redirectTo', options);
  }),
  redirectToWeb: debounce((options: TAdkCallOptions) => {
    return _toWeb('redirectTo', options);
  }),

  navigateBack: debounce((options: TAdkCallOptions) => {
    return callAppPromise('navigateBack', options);
  }),
  goBack: debounce((options?: TAdkCallOptions) => {
    return callAppPromise('navigateBack', options);
  }),

  navigateBackTo: debounce((options: TAdkCallOptions) => {
    return callAppPromise('navigateBackTo', options);
  }),
  goBackTo: debounce((options: TAdkCallOptions) => {
    return callAppPromise('navigateBackTo', options);
  }),
  goBackToApp: debounce((options: TAdkCallOptions) => {
    return _toApp('navigateBackTo', options);
  }),
  goBackToWeb: debounce((options: TAdkCallOptions) => {
    return _toWeb('navigateBackTo', options);
  }),

  openAppSettings: debounce((options: TAdkCallOptions) => {
    return callAppPromise('openAppSettings', options);
  }),
  openMiniProgram: debounce((options: TAdkCallOptions) => {
    return callAppPromise('openMiniProgram', options);
  }),
  openUri: debounce((options: TAdkCallOptions) => {
    return callAppPromise('openUri', options);
  }),
};

export default actions;
