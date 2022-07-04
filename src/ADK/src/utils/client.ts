import getRandomStr from './getRandomStr';

const WINDOW = (typeof window !== 'undefined' ? window : {}) as Window;
const dpr: number = WINDOW.devicePixelRatio || 2;
const UA: string = WINDOW.navigator?.userAgent || '';
const UAData = WINDOW.navigator?.userAgentData;
const _contextId = getRandomStr(6, 36);

const getMatchStrFromUA = (regExp: RegExp): string => {
  const match = UA.match(regExp);
  return match ? match[1] : '';
};


// /**
//  * Environment
//  */
// const isDev: boolean = ENV === 'development' || NODE_ENV === 'development';
// const isTest: boolean = ENV === 'test';
// const isProduction: boolean = ENV === 'production';


/**
 * 设备信息
 */

// iOS
const isIOS: boolean = /iPad|iPhone|iPod/i.test(UA);
const iOSVersion: string = isIOS ? getMatchStrFromUA(/OS (\d+(?:_\d+)*) like Mac OS/i).replace(/_/g, '.') : '';

// Android
const isAndroid: boolean = /Android/i.test(UA) && !/Windows Phone/i.test(UA);
const androidVersion: string = getMatchStrFromUA(/Android (\d+(?:\.\d+)*)/i);

// 此处的 Mobile 是指移动设备，并不仅指手机
const isMobile: boolean = isIOS || isAndroid || /Mobile|Phone/i.test(UA) || (UAData && UAData.mobile);
const isPC: boolean = !isMobile;

// // WebView
// const iOSSafariVersion: string =
//   (isIOS && getMatchStrFromUA(/Version\/(\d+(?:\.\d+)*)/i))
//   || iOSVersion;  // 不支持获取 Safari Version 的使用 iOSVersion
// const chromeVersion: string = (
//   isIOS
//     ? getMatchStrFromUA(/CriOS\/(\d+(?:\.\d+)*)/i)
//     : getMatchStrFromUA(/Chrome\/(\d+(?:\.\d+)*)/i)
// );


/**
 * App 信息
 */

// 天眼企服 App
const isTYQFApp: boolean = /TYQF\//i.test(UA);  // 企服新版 App（>=1.1.21）
const isTYQFIOSApp: boolean = isTYQFApp && isIOS;
const isTYQFAndroidApp: boolean = isTYQFApp && isAndroid;
const isTYQFOutmodedApp: boolean = /FromTYQF(?:Ios|Android)Client\(/i.test(UA);  // 企服老版 App（<1.1.21）

// 天眼查 App
const isTYCApp: boolean = /FromTYC(?:Ios|Android)Client/i.test(UA) && !/TYQF/i.test(UA);
const isTYCIOSApp: boolean = isTYCApp && isIOS;
const isTYCAndroidApp: boolean = isTYCApp && isAndroid;

// TYBiz App
const isTYBizApp: boolean =  /TYBiz/i.test(UA);
const isTYBizIOSApp: boolean = isTYBizApp && isIOS;
const isTYBizAndroidApp: boolean = isTYBizApp && isAndroid;

const appVersion: string = (
  isTYQFApp ? getMatchStrFromUA(/TYQF\/(\d+(?:\.\d+)*)/i)
    : isTYBizApp ? getMatchStrFromUA(/TYBiz\/(\d+(?:\.\d+)*)/i)
      : isTYCApp ? getMatchStrFromUA(/FromTYC\w+\(appVersion\/\w+ (\d+(?:\.\d+)*)/i)
        : ''
);
const factory: string = (
  isIOS ? 'Apple'
  : isTYCApp ? getMatchStrFromUA(/appDevice\/([^ ,)]+)/i)
    : (getMatchStrFromUA(/Factory\/([^ ]+)/i))
);
const device: string = (
  isTYQFApp || isTYBizApp
    ? (isIOS ? getMatchStrFromUA(/like Mac OS X; (.+)\) AppleWebKit/i)
      : factory + ' ' + getMatchStrFromUA(/Android \d+(?:\.\d+)*; .*\b(\w+) Build/i))
    : isTYCApp ? getMatchStrFromUA(/appDevice\/([^,)]+)/i)
      : ''
);
const channel: string = getMatchStrFromUA(/Channel\/([^ ]+)/i);
const statusBarHeight: number = + getMatchStrFromUA(/StatusBarHeight\/(\d+)/i);
const _networkPolicy: string = getMatchStrFromUA(/NetworkPolicy\/(\d)/i);
const networkPolicy: number | null = _networkPolicy ? +_networkPolicy : null;

// Wechat
const isWechat: boolean = /MicroMessenger/i.test(UA);
const wechatVersion: string = getMatchStrFromUA(/MicroMessenger\/(\d+(?:\.\d+)*)/i);

// 钉钉
const isDingTalk: boolean = /DingTalk/i.test(UA);
const dingTalkVersion: string = getMatchStrFromUA(/DingTalk\/(\d+(?:\.\d+)*)/i);


/**
 * 比较版本号的大小
 * @param {string} 版本号
 * @return {number} 比较结果，-1 (a < b)，0 (a = b)，1 (a > b)
 */
const compareVersions = (a: string, b: string): number => {
  if (a === b) {
    return 0;
  }

  const aArr = a.split('.');
  const bArr = b.split('.');
  const bLen = bArr.length;
  for (let i = 0; i < bLen; i++) {
    const aCode = parseInt(aArr[i]);
    const bCode = parseInt(bArr[i]);
    if (isNaN(aCode) || aCode < bCode) {
      return -1;
    } else if (aCode > bCode) {
      return 1;
    }
  }

  return aArr.length > bLen ? 1 : 0;
};

// Greater Than the Target Version
const gtVersion = (currentVersion: string, targetVersion: string): boolean => {
  return compareVersions(currentVersion, targetVersion) > 0;
};

// Greater Than or Equal to the Target Version
const gteVersion = (currentVersion: string, targetVersion: string): boolean => {
  return compareVersions(currentVersion, targetVersion) >= 0;
};

// Less Than the Target Version
const ltVersion = (currentVersion: string, targetVersion: string): boolean => {
  return compareVersions(currentVersion, targetVersion) < 0 && compareVersions(currentVersion, '0') >= 0;
};

// Less Than or Equal to the Target Version
const lteVersion = (currentVersion: string, targetVersion: string): boolean => {
  return compareVersions(currentVersion, targetVersion) <= 0 && compareVersions(currentVersion, '0') >= 0;
};

const greaterThan = (targetVersion: string, currentVersion: string = appVersion): boolean =>
  gtVersion(currentVersion, targetVersion);
const greaterThanOrEqual = (targetVersion: string, currentVersion: string = appVersion): boolean =>
  gteVersion(currentVersion, targetVersion);
const lessThan = (targetVersion: string, currentVersion: string = appVersion): boolean =>
  ltVersion(currentVersion, targetVersion);
const lessThanOrEqual = (targetVersion: string, currentVersion: string = appVersion): boolean =>
  lteVersion(currentVersion, targetVersion);
const notGreaterThan = lessThanOrEqual;
const notLessThan = greaterThanOrEqual;


export {
  UA,
  UAData,
  dpr,
  _contextId,
  // isDev,
  // isTest,
  // isProduction,
  // webBridgeVersion,

  isIOS,
  iOSVersion,
  isAndroid,
  androidVersion,
  isMobile,
  isPC,
  // iOSSafariVersion,
  // chromeVersion,

  isTYCApp,
  isTYCIOSApp,
  isTYCAndroidApp,

  isTYQFApp,
  isTYQFIOSApp,
  isTYQFAndroidApp,
  isTYQFOutmodedApp,

  isTYBizApp,
  isTYBizIOSApp,
  isTYBizAndroidApp,

  appVersion,
  device,
  factory,
  channel,
  statusBarHeight,
  networkPolicy,

  isWechat,
  wechatVersion,
  isDingTalk,
  dingTalkVersion,

  compareVersions,
  gtVersion,
  gteVersion,
  ltVersion,
  lteVersion,
  greaterThan,
  greaterThanOrEqual,
  lessThan,
  lessThanOrEqual,
  notGreaterThan,
  notLessThan,
};
