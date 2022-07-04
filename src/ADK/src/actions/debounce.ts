// import { TAdkData, TAdkRes } from '../types';

const REJECT_RES: TAdkRes = { code: '-5', msg: '您的手速太快了， 请稍后再试...', data: {} };

const debounce = (fn: (...args: any) => Promise<TAdkData | TAdkRes>, wait = 500) => {
  let t = 0;
  return (...args: any): Promise<TAdkData | TAdkRes> => {
    const shouldRun = Date.now() - t > wait;
    t = Date.now();
    return shouldRun ? fn(...args) : Promise.reject(REJECT_RES);
  };
};

export default debounce;
