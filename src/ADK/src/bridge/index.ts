import { options } from '../config';
import { _handleBroadcast } from '../broadcast/receive';
// import { TAdkData, TAdkRes, TAdkCallOptions, TAdkHandler } from '../types';
import { _contextId, isIOS } from '../utils/client';
import { isPlainObject, isFunction } from '../utils/typeof';
import getRandomStr from '../utils/getRandomStr';
import isSupported from '../utils/isSupported';
import EventEmitter from '../utils/EventEmitter';

export interface TActionMessage {
  action: string;
  data?: TAdkData;
  callbackId?: string;
  timeout?: number;
};

export interface TCallbackMessage {
  callbackId: string;
  code: string;
  msg?: string;
  data?: TAdkData;
};

const WINDOW = (typeof window !== 'undefined' ? window : {}) as Window;
const _callbackHandlers: TAdkData = {};
const _getTimestamp = () => Date.now();  // 性能分析用


/*********************
 *  Native Call Web  *
 *********************/

const _appEvent = new EventEmitter();
const on = (action: string, handler: TAdkHandler) => _appEvent.on(action, handler);
const off = (action: string, handler?: TAdkHandler) => _appEvent.off(action, handler);
const once = (action: string, handler: TAdkHandler) => _appEvent.once(action, handler);

function callWeb(message: TActionMessage): void;
function callWeb(message: TCallbackMessage): void;
function callWeb(message: any): void {
  options.debug && console.log('[callWeb_original_message]', message);
  const { action, data = {}, code = '-1', msg = '', callbackId = '0' } = message || {};

  if (action) {
    console.log('appCallWeb', action, message, _getTimestamp(), WINDOW.performance?.timing?.navigationStart + WINDOW.performance?.now());

    // 触发 action
    action === 'broadcast' && _handleBroadcast(data);
    _appEvent.emit(action, data as TAdkData);

    // // 向 Native 发送触发 action 的回调
    // if (callbackId) {
    //   const { code = '0', data = {}, msg = '' } = returnData || {};
    //   _postMessageToApp({
    //     callbackId,
    //     code,
    //     data,
    //     msg,
    //   });
    // }
  } else if (callbackId) {
    // 处理 Web callApp 的回调
    const callAppBack = _callbackHandlers[callbackId];
    if (callAppBack) {
      console.log('appCallback', callAppBack.action, code, message, callbackId, _getTimestamp() - callAppBack.timestamp + 'ms');
      try {
        const { success, fail, complete } = callAppBack;
        if (code === '0') {
          success && success.call(success, data as TAdkData);
        } else {
          fail && fail.call(fail, { code, data, msg } as TAdkRes);
        }
        complete && complete.call(complete, { code, data, msg } as TAdkRes);
      } catch (err) {
        // reportError(err, 'appBridge 回调函数执行异常');  // 上报错误
      }
      delete _callbackHandlers[callbackId];
    }
  }
}


/*********************
 *  Web Call Native  *
 *********************/

// 获取自增 ID
let _uniqueId: number = 0;
const _getUniqueId = (): number => {
  if (_uniqueId === Number.MAX_SAFE_INTEGER) {
    _uniqueId = 0;
  }
  return ++_uniqueId;
};

// 校验 options
const _checkOptions = (action: string, options: TAdkCallOptions = {}): boolean => {
  if (isFunction(options.preventDefault)) {
    console.error(`ADK Error\n- ADK 方法的参数不能为 Event 对象，会导致与客户端通信失败。\n- JS Bridge action: '${action}'`);
    return false;
  }
  return true;
};

// 是否注入 nativeBridge
const _hasBridge = () => isIOS ? WINDOW.webkit?.messageHandlers?.TYNativeBridge : WINDOW.TYNativeBridge;

// 处理 nativeBridge 注入之前，Web 发起的 callApp 请求
let _callAppQueue: Array<TActionMessage> | null = [];
if (!_hasBridge()) {
  // nativeBridge ready 后，将 callApp 的 message 逐一发送
  _appEvent.once('bridgeReady', () => {
    Array.isArray(_callAppQueue) && _callAppQueue.forEach((message) => {
      _postMessageToApp(message);
    });
    _callAppQueue = null;
  });
}

// 通过 Native 注入的方法传送数据
function _postMessageToApp(message: TActionMessage): void;
function _postMessageToApp(message: TCallbackMessage): void;
function _postMessageToApp(message: any): void {
  if (_hasBridge()) {
    try {
      const res = (isIOS
        ? WINDOW.webkit.messageHandlers.TYNativeBridge.postMessage(message)
        : WINDOW.TYNativeBridge.postMessage(JSON.stringify(message))
      );
      // 支持安卓同步返回
      isPlainObject(res) && callWeb(res);
    } catch (err: any) {
      const errMsg = 'nativeBridge.postMessage 通信异常';
      callWeb({
        callbackId: message.callbackId || '',
        code: '-1',
        msg: err.message || errMsg,
      });
      // reportError(err, {
      //   msg: `${errMsg}, callbackId ${callbackId}`,
      //   group: ['utils/appBridge', errMsg + (err.message || '')],
      //   level: 'error',
      // });
    }
  } else if (Array.isArray(_callAppQueue)) {
    // nativeBridge ready 前，将 callApp 的 message 存入队列
    _callAppQueue.push(message);

    // // push 数量每达到 20 的倍数上报一次异常
    // const queueLength = _callAppQueue.length;
    // if (queueLength % 20 === 0) {
    //   reportError(`appBridge: _callAppQueue.length up to ${queueLength}`);
    // }
  }
}

function callApp(action: string, options: TAdkCallOptions = {}): Function {
  _checkOptions(action, options);
  const { success, fail, complete, timeout, ...data } = options;
  const message: TActionMessage = { action, data };
  let callbackId: string;

  if (success || fail || complete || isIOS) {  // iOS callbackId 为空会闪退，所以 iOS 强制分配 callbackId
    const randomStr = getRandomStr(4, 16);
    const uniqueId = _getUniqueId();
    callbackId = `${_contextId}-${randomStr}-${uniqueId}`;
    _callbackHandlers[callbackId] = { action, success, fail, complete, timestamp: _getTimestamp() };
    message.callbackId = callbackId;
  }

  console.log('webCallApp', action, message, message.callbackId || 0);
  _postMessageToApp(message);

  return () => {
    if (callbackId) {
      delete _callbackHandlers[callbackId];
    }
  };
}

function callAppPromise(action: string, options: TAdkCallOptions = {}): Promise<TAdkData | TAdkRes> {
  _checkOptions(action, options);
  return new Promise(resolve => {
    callApp(action, {
      ...options,
      complete: res => {
        const { complete } = options;
        complete && complete.call(complete, res);
        resolve(res);
      },
    });
  }).then(res => {
    const { code, data } = res as TAdkRes;
    return code === '0' ? Promise.resolve(data as TAdkData) : Promise.reject(res as TAdkRes);
  });
}


// 对 Native 公开 callWeb 方法
if (isSupported('bridge')) {
  WINDOW.TYWebBridge = { callWeb };
}

export { callApp, callAppPromise, on, off, once };
