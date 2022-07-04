import { callAppPromise } from '../bridge';
// import { TAdkData, TAdkCallOptions } from '../types';

const stringifyValue = ({ value, ...others }: TAdkData) => ({
  ...others,
  value: JSON.stringify(value),
});

const parseValue = ({ value, ...others }: TAdkData) => ({
  ...others,
  value: JSON.parse(value),
});

const actions = {
  setStorage(options: TAdkCallOptions) {
    return callAppPromise('setStorage', stringifyValue(options));
  },
  getStorage(options: TAdkCallOptions) {
    return callAppPromise('getStorage', options).then(
      data => Promise.resolve(parseValue(data)),
      res => Promise.reject(res)
    );
  },
  removeStorage(options: TAdkCallOptions) {
    return callAppPromise('removeStorage', options);
  },
  setSessionStorage(options: TAdkCallOptions) {
    return callAppPromise('setSessionStorage', stringifyValue(options));
  },
  getSessionStorage(options: TAdkCallOptions) {
    return callAppPromise('getSessionStorage', options).then(
      data => Promise.resolve(parseValue(data)),
      res => Promise.reject(res)
    );
  },
  removeSessionStorage(options: TAdkCallOptions) {
    return callAppPromise('removeSessionStorage', options);
  },
};

export default actions;
