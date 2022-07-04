import { options } from '../config';
import { isTYBizApp, isTYQFApp, networkPolicy, notLessThan } from './client';
import { isFunction, isNumber } from './typeof';

const WINDOW = (typeof window !== 'undefined' ? window : {}) as Window;

const isSupported = (feature: string): boolean => {
  switch (feature) {
    case 'bridge':
      return options.debug || (isTYQFApp ? notLessThan('1.1.21') : isTYBizApp);

    case 'appFetch':
    case 'appXHR':
    case 'appSendBeacon':
    case 'networkPolicy':  // WebView 网络拦截策略
      return isNumber(networkPolicy);

    case 'appSendBeaconBlob':
      // 兼容性：iOS Safari >= 14 || Android Chrome >= 76
      // 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/Blob
      return isSupported('appSendBeacon') && isFunction((new Blob()).text);

    case 'appSendBeaconFormData':
      // 兼容性：iOS Safari >= 11.3 || Android Chrome >= 50
      // 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/FormData
      return isSupported('appSendBeacon') && isFunction((new FormData()).entries);

    case 'fetch':
      if (!('fetch' in WINDOW)) {
        return false;
      }
      try {
        new Headers();
        new Request('');
        new Response();
        return true;
      } catch (e) {
        return false;
      }

    // case 'openMiniProgram':
    //   return notLessThan('1.10');

    // case 'saveImage':
    //   return (isIOSApp && notLessThan('1.11.5')) || (isAndroidApp && notLessThan('1.11.6'));

    default:
      return false;
  }
};

export default isSupported;
