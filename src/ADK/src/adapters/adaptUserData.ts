// import { TAdkData } from '../types';

const adaptUserData = (data: TAdkData): TAdkData => {
  const { token } = data;
  return { token };
};

export default adaptUserData;
