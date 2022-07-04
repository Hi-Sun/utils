import { Blob as BlobPolyfill } from 'blob-polyfill';  // https://github.com/bjornstar/blob-polyfill
import 'formdata-polyfill';  // https://www.npmjs.com/package/formdata-polyfill
import { callApp } from '../bridge';
// import { TAdkData } from '../types';
import getFullUrl from '../utils/getFullUrl';
import isSupported from '../utils/isSupported';
import { isBlob, isFormData, isNull, isString, isUndefined, isURLObject } from '../utils/typeof';

const WINDOW = (typeof window !== 'undefined' ? window : {}) as Window;
const ORIGINAL_SENDBEACON = '_originalSendBeacon';
const DEFAULT_MIME_TYPE = 'text/plain; charset=utf-8';

/**
 * Web 原来的 sendBeacon
 */
const webSendBeacon = (WINDOW.navigator || {})[ORIGINAL_SENDBEACON] || WINDOW.navigator?.sendBeacon;

/**
 * 通过 bridge 发送 POST 请求
 * @param url data 将要被发送到的网络地址。
 * @param body 将要发送的 PlainObject 类型的数据。
 */
const post = (url: string | URL, body: TAdkData = {}, mimeType: string = DEFAULT_MIME_TYPE) => {
  callApp('request', {
    url: getFullUrl(url),
    method: 'POST',
    headers: { 'Content-Type': mimeType },
    body,
  });
};

/**
 * 通过客户端代理发送 navigator.sendBeacon 请求
 * 兼容性：目前仅支持发送实质内容为 JSON String 的数据
 * 参考：https://www.w3.org/TR/beacon/
 * @param url data 将要被发送到的网络地址。
 * @param data 将要发送的 ArrayBufferView 或 Blob, DOMString 或者 FormData 类型的数据。
 * @returns 当用户代理成功把数据加入传输队列时，sendBeacon() 方法将会返回 true，否则返回 false。
 */
const appSendBeacon = (url: string | URL, data?: BodyInit | null | undefined): boolean => {
  try {
    switch (true) {
      case isBlob(data):
        const blobData = data as Blob;
        // blob-polyfill 参考：https://github.com/bjornstar/blob-polyfill
        const polyfilledBlobData = (
          typeof blobData.text === 'function'
            ? blobData
            : new BlobPolyfill([blobData], { type: blobData.type })
        );
        // Blob.text() 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/Blob
        polyfilledBlobData.text()
          .then(text => text && post(url, text[0] === '{' ? JSON.parse(text) : {}, polyfilledBlobData.type))
          .catch(e => console.error(e));
        // sendBeacon 不支持异步返回，所以如果这里发生异常无法返回 false
        return true;

      case isFormData(data):
        const formData = data as FormData;
        // formdata-polyfill 参考：https://www.npmjs.com/package/formdata-polyfill
        if (typeof formData.entries === 'function') {
          const body: TAdkData = {};
          // formData.entries() 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/FormData
          for (const entry of formData.entries()) {
            body[entry[0]] = entry[1];
          }
          post(url, body);
          return true;
        } else {
          return false;
        }

      case isString(data):
        post(url, (data as string)[0] === '{' ? JSON.parse(data as string) : {});
        return true;

      case isNull(data):
      case isUndefined(data):
        post(url, {});
        return true;

      // TODO: 处理 ArrayBufferView
      // case isArrayBufferView(data):
      //   return true;

      default:
        return false;
    }
  } catch (e) {
    return false;
  }
};

/**
 * 通用的 sendBeacon 方法
 * @param url data 将要被发送到的网络地址。
 * @param data 将要发送的 ArrayBufferView 或 Blob, DOMString 或者 FormData 类型的数据。
 * @returns 当用户代理成功把数据加入传输队列时，sendBeacon() 方法将会返回 true，否则返回 false。
 */
const sendBeacon = (url: string | URL, data?: BodyInit | null | undefined): boolean => {
  if (WINDOW.navigator?.sendBeacon) {
    return WINDOW.navigator.sendBeacon(url, data);
  } else {
    fetch(
      isURLObject(url) ? (url as URL).href : url as string,
      {
        method: 'POST',
        keepalive: true,
        body: data,
      }
    );
    // sendBeacon 不支持异步返回，所以如果这里发生异常无法返回 false
    return true;
  }
};

/**
 * 启用客户端对 navigator.sendBeacon 的代理
 * 参考：原生 navigator.sendBeacon 兼容性 iOS Safari >= 11.3 || Android Chrome >= 42
 * @returns 处理结果
 */
const enableSendBeaconProxy = (): boolean => {
  if (isSupported('appSendBeacon')) {
    WINDOW.navigator[ORIGINAL_SENDBEACON] = webSendBeacon;
    WINDOW.navigator.sendBeacon = appSendBeacon;
    return true;
  }
  return false;
};

/**
 * 禁用客户端对 navigator.sendBeacon 的代理
 * @returns 处理结果
 */
const disableSendBeaconProxy = (): boolean => {
  WINDOW.navigator.sendBeacon = webSendBeacon;
  delete WINDOW.navigator[ORIGINAL_SENDBEACON];
  return true;
};

export { sendBeacon, appSendBeacon, webSendBeacon, enableSendBeaconProxy, disableSendBeaconProxy };
