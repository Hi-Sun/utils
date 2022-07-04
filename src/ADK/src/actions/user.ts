import { callAppPromise } from '../bridge';
// import { TAdkCallOptions } from '../types';
import adaptUserData from '../adapters/adaptUserData';
import debounce from './debounce';

const actions = {
  getUserInfo(options?: TAdkCallOptions) {
    return callAppPromise('getUserInfo', options).then(
      data => Promise.resolve(adaptUserData(data)),
      res => Promise.reject(res)
    );
  },
  login: debounce((options?: TAdkCallOptions) => {
    return callAppPromise('login', options).then(
      data => Promise.resolve(adaptUserData(data)),
      res => Promise.reject(res)
    );
  }),
  withLogin(options?: TAdkCallOptions) {
    const { fail, ...othersOptions } = options || {};
    return callAppPromise('getUserInfo', othersOptions)
      .catch(() => callAppPromise('login', options))
      .then(
        data => Promise.resolve(adaptUserData(data)),
        res => Promise.reject(res)
      );
  },
  logout: debounce((options?: TAdkCallOptions) => {
    return callAppPromise('logout', options);
  }),
};

export default actions;
