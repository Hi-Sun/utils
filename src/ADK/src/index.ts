/**
 * App Development Kit
 */

import { version } from '../package.json';
import * as client from './utils/client';
import * as typeofs from './utils/typeof';
import isSupported from './utils/isSupported';
import * as config from './config';
import * as bridge from './bridge';
import actions from './actions';
import * as broadcasts from './broadcast';
import proxy from './proxy';
// import { TAdkData, TAdkRes, TAdkCallOptions, TAdkHandler } from './types';

const ADK = {
  ...client,
  ...config,
  ...bridge,
  ...actions,
  ...broadcasts,
  ...proxy,
  ...typeofs,
  isSupported,
  version,
};

if (isSupported('bridge')) {
  const WINDOW = (typeof window !== 'undefined' ? window : {}) as Window;
  WINDOW.ADK = ADK;
}

declare global {
  interface Window {
    ADK?: typeof ADK;
  }

  interface TAdkData {
    [key: string | number]: any;
  }

  interface TAdkRes {
    code?: string;
    msg?: string;
    data?: TAdkData;
  }

  interface TAdkCallOptions {
    success?: (data: TAdkData) => any;
    fail?: (res: TAdkRes) => any;
    complete?: (res: TAdkRes) => any;
    timeout?: number;
    [key: string | number]: any;
  }

  interface TAdkBroadcastItem {
    key: string;
    data?: TAdkData;
    [key: string | number]: any;
  }

  type TAdkHandler = (data: TAdkData) => any;
}

export default ADK;
// export type { TAdkData, TAdkRes, TAdkCallOptions, TAdkHandler };
