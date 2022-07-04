// import { TAdkData } from '../types';

// 行政区划代码参考：http://www.mca.gov.cn/article/sj/xzqh/1980/
const PROVINCE_NAMES: TAdkData = {
  11: { name: '北京', fullName: '北京市' },
  12: { name: '天津', fullName: '天津市' },
  13: { name: '河北', fullName: '河北省' },
  14: { name: '山西', fullName: '山西省' },
  15: { name: '内蒙古', fullName: '内蒙古自治区' },
  21: { name: '辽宁', fullName: '辽宁省' },
  22: { name: '吉林', fullName: '吉林省' },
  23: { name: '黑龙江', fullName: '黑龙江省' },
  31: { name: '上海', fullName: '上海市' },
  32: { name: '江苏', fullName: '江苏省' },
  33: { name: '浙江', fullName: '浙江省' },
  34: { name: '安徽', fullName: '安徽省' },
  35: { name: '福建', fullName: '福建省' },
  36: { name: '江西', fullName: '江西省' },
  37: { name: '山东', fullName: '山东省' },
  41: { name: '河南', fullName: '河南省' },
  42: { name: '湖北', fullName: '湖北省' },
  43: { name: '湖南', fullName: '湖南省' },
  44: { name: '广东', fullName: '广东省' },
  45: { name: '广西', fullName: '广西壮族自治区' },
  46: { name: '海南', fullName: '海南省' },
  50: { name: '重庆', fullName: '重庆市' },
  51: { name: '四川', fullName: '四川省' },
  52: { name: '贵州', fullName: '贵州省' },
  53: { name: '云南', fullName: '云南省' },
  54: { name: '西藏', fullName: '西藏自治区' },
  61: { name: '陕西', fullName: '陕西省' },
  62: { name: '甘肃', fullName: '甘肃省' },
  63: { name: '青海', fullName: '青海省' },
  64: { name: '宁夏', fullName: '宁夏回族自治区' },
  65: { name: '新疆', fullName: '新疆维吾尔自治区' },
  71: { name: '台湾', fullName: '台湾省' },
  81: { name: '香港', fullName: '香港特别行政区' },
  82: { name: '澳门', fullName: '澳门特别行政区' },
};

const adaptLocationData = (data: TAdkData): TAdkData => {
  const {
    province,
    provinceName,
    provinceCode,
    cityCode,
    locationCode = '',
  } = data;
  const isValidCode = /^\d{6}$/.test(locationCode);
  const provinceId = isValidCode
    ? locationCode.replace(/^(\d{2}).*/, '$1')
    : '';
  const locationData = {
    province:
      provinceId in PROVINCE_NAMES
        ? PROVINCE_NAMES[provinceId].fullName
        : province || '',
    provinceName:
      provinceId in PROVINCE_NAMES
        ? PROVINCE_NAMES[provinceId].name
        : provinceName || '',
    provinceCode: provinceCode || (provinceId ? `${provinceId}0000` : ''),
    cityCode:
      cityCode || (isValidCode ? locationCode.replace(/\d{2}$/, '00') : ''),
    ...data,
  };
  return locationData;
};

export default adaptLocationData;
