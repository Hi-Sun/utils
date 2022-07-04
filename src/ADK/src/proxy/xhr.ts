// import 'formdata-polyfill';  // https://www.npmjs.com/package/formdata-polyfill
import { callApp } from '../bridge';
// import { TAdkData, TAdkRes, TAdkHandler } from '../types';
import EventEmitter from '../utils/EventEmitter';
import getFullUrl from '../utils/getFullUrl';
import isSupported from '../utils/isSupported';
import { isString, isPlainObject } from '../utils/typeof';

interface TResponseData {
  status: number;
  statusText: string;
  headers: TAdkData;
  body: any;
};

const WINDOW = (typeof window !== 'undefined' ? window : {}) as Window;
const ORIGINAL_XHR = '_originalXHR';
const INITIAL_RESPONSE_DATA = {
  status: 0,
  statusText: '',
  headers: {},
  body: '',
};


/**
 * Web 原来的 XHR
 */
const WebXHR = (WINDOW[ORIGINAL_XHR] || WINDOW.XMLHttpRequest) as Window['XMLHttpRequest'];


/**
 * 由客户端代理 XHR
 * 参考：
 *  - https://xhr.spec.whatwg.org/
 *  - https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 *  - https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest
 */
class AppXHR {

  /************
   *  STATES  *
   ************/

  readonly UNSENT: number = 0;
  readonly OPENED: number = 1;
  readonly HEADERS_RECEIVED: number = 2;
  readonly LOADING: number = 3;
  readonly DONE: number = 4;

  /**
   * readyState
   * 参考：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
   */
  private _readyState: number = this.UNSENT;
  private _changeReadyState(readyState: number, shouldEmitEvent: boolean = true): void {
    this._readyState = readyState;
    shouldEmitEvent && this._emitEvent('readystatechange');
  };
  get readyState(): number {
    return this._readyState;
  };

  /**
   * 是否是失败状态
   */
  private _isFailed: boolean = false;


  /************
   *  EVENTS  *
   ************/

  onabort: ((this: AppXHR, ev: ProgressEvent) => any) | null = null;
  onerror: ((this: AppXHR, ev: ProgressEvent) => any) | null = null;
  onload: ((this: AppXHR, ev: ProgressEvent) => any) | null = null;
  onloadend: ((this: AppXHR, ev: ProgressEvent) => any) | null = null;
  onloadstart: ((this: AppXHR, ev: ProgressEvent) => any) | null = null;
  onprogress: ((this: AppXHR, ev: ProgressEvent) => any) | null = null;
  onreadystatechange: ((this: AppXHR, ev: Event) => any) | null = null;
  ontimeout: ((this: AppXHR, ev: ProgressEvent) => any) | null = null;

  private _eventEmitter: EventEmitter = new EventEmitter();

  // addEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(type: K, listener: (this: XMLHttpRequestEventTarget, ev: XMLHttpRequestEventTargetEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: 'readystatechange' | 'abort' | 'error' | 'load' | 'loadend' | 'loadstart' | 'progress' | 'timeout', listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
    this._eventEmitter.on(type, listener as TAdkHandler);
  };

  // removeEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(type: K, listener: (this: XMLHttpRequestEventTarget, ev: XMLHttpRequestEventTargetEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
    this._eventEmitter.off(type, listener as TAdkHandler);
  };

  /**
   * 触发 Event
   * @param eventName 
   * @param eventInit 
   * @param eventType 
   */
  private _emitEvent(eventName: string, eventInit?: TAdkData, eventType: string = 'Event'): void {
    const handlerMap: TAdkData = {
      abort: this.onabort,
      error: this.onerror,
      load: this.onload,
      loadend: this.onloadend,
      loadstart: this.onloadstart,
      progress: this.onprogress,
      timeout: this.ontimeout,
      readystatechange: this.onreadystatechange,
    };
    if (eventName in handlerMap) {
      // 参考：
      //  - https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
      //  - https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent/ProgressEvent
      const event = new (eventType === 'ProgressEvent' ? ProgressEvent : Event)(eventName, eventInit)
      this._eventEmitter.emit(eventName, event);
      if (typeof handlerMap[eventName] === 'function') {
        handlerMap[eventName].call(this, event);
      }
    }
  };

  /**
   * 触发 ProgressEvent
   * @param eventName 
   * @param eventInit 
   */
  private _emitProgressEvent(eventName: string, eventInit?: TAdkData): void {
    this._emitEvent(eventName, eventInit, 'ProgressEvent');
  };


  /**********
   *  INIT  *
   **********/

  constructor(options: TAdkData = {}) {
    this._init(options);
  };

  private _requestData: TAdkData = {};

  /**
   * 初始化 App 私有配置
   * 参考：http://wiki.jindidata.com/pages/viewpage.action?pageId=46999821#id-%E4%BC%81%E6%9C%8DJSBridgeactions-request
   * @param options App request options.
   */
  private _init(options: TAdkData = {}): void {
    const {
      headers = {},
      privateHeaders = [],  // 敏感、隐私的 headers
      encrypt = 'none',  // 数据加密策略，可选值：none、request、response、all
      policy = 0,  // 资源获取策略，目前仅支持 0 和 3，参考：http://wiki.jindidata.com/pages/viewpage.action?pageId=48563060
    } = options;
    this._requestData = {
      headers,
      privateHeaders,
      encrypt,
      policy,
    };
  };

  /**
   * Initializes a request, sets the request method, request URL, and synchronous flag.
   * Throws a "SyntaxError" DOMException if either method is not a valid method or url cannot be parsed.
   * Throws a "SecurityError" DOMException if method is a case-insensitive match for `CONNECT`, `TRACE`, or `TRACK`.
   * Throws an "InvalidAccessError" DOMException if async is false, current global object is a Window object, and the timeout attribute is not zero or the responseType attribute is not the empty string.
   */
  open(method: string, url: string | URL, async: boolean = true, username?: string | null, password?: string | null): void {
    this._requestData = {
      ...this._requestData,
      url: getFullUrl(url),
      method,
    };
  };

  /**
   * Combines a header in author request headers.
   * Throws an "InvalidStateError" DOMException if either state is not opened or the send() flag is set.
   * Throws a "SyntaxError" DOMException if name is not a header name or if value is not a header value.
   */
  setRequestHeader(name: string, value: string): void {
    // 如果多次对同一个请求头赋值，只会生成一个合并了多个值的请求头。
    // 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/setRequestHeader
    const lowerCasedName = name.toLowerCase();
    this._requestData.headers[lowerCasedName] = (this._requestData.headers[lowerCasedName] || '') + value;
  };

  /**
   * Set a request body.
   * @param body 
   * @returns void
   */
  private _setRequestBody(body?: Document | XMLHttpRequestBodyInit | null): void {
    try {
      switch (true) {
        case isPlainObject(body):
          this._requestData.body = body;
          return;

        case isString(body):
          this._requestData.body = (body as string)[0] === '{' ? JSON.parse(body as string) : {};
          return;

        // case isFormData(body): {
        //   const formData = body as FormData;
        //   // formdata-polyfill 参考：https://www.npmjs.com/package/formdata-polyfill
        //   if (isFunction(formData.entries)) {
        //     const body: TAdkData = {};
        //     // formData.entries() 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/FormData
        //     for (const entry of formData.entries()) {
        //       body[entry[0]] = entry[1];
        //     }
        //   }
        // }

        default:
      }
    } catch(e) {}
    this._requestData.body = {};
  };

  /**
   * True when credentials are to be included in a cross-origin request. False when they are to be excluded in a cross-origin request and when cookies are to be ignored in its response. Initially false.
   * When set: throws an "InvalidStateError" DOMException if state is not unsent or opened, or if the send() flag is set.
   * 备注：App 代理无跨域限制
   */
  withCredentials: boolean = false;

  /**
   * An unsigned long representing the number of milliseconds a request can take before automatically being terminated.
   * 参考：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout
   */
  private _timeout: number = 0;
  set timeout(timeout: number) {
    if (timeout > 0) {
      this._timeout = timeout;
    }
  };
  get timeout(): number {
    return this._timeout;
  };


  /*************
   *  REQUEST  *
   *************/

  /**
   * Initiates the request. The body argument provides the request body, if any, and is ignored if the request method is GET or HEAD.
   * Throws an "InvalidStateError" DOMException if either state is not opened or the send() flag is set.
   * 参考：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send
   */
  private _requestDestroyer: Function | null = null;

  /**
   * 如果设置了 timeout，返回一个带超时的 promise
   * @param promise 原始 promise
   * @returns 可能带超时的 promise
   */
  private _withTimeout(promise: Promise<TAdkRes>): Promise<any> {
    if (this.timeout > 0) {
      const timeoutPromise = new Promise((resolve, reject) => setTimeout(reject, this.timeout));
      return Promise.race([promise, timeoutPromise]);
    }
    return promise;
  };

  /**
   * Sends the request. If the request is asynchronous (which is the default), this method returns as soon as the request is sent.
   * @param body Optional request body for POST, PUT, and DELETE.
   */
  send(body?: Document | XMLHttpRequestBodyInit | null): void {
    if (['POST', 'PUT', 'DELETE'].indexOf(this._requestData.method) >= 0) {
      this._setRequestBody(body);
    }
    this._changeReadyState(this.OPENED, false);
    this._emitProgressEvent('loadstart');
    this._withTimeout(new Promise(resolve => {
      this._requestDestroyer = callApp('request', {
        ...this._requestData,
        complete: (res) => resolve(res as TAdkRes),
      });
    })).then(this._handleResponse, this._handleTimeout);
  };

  /**
   * Aborts the request if it has already been sent.
   * 参考：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort
   */
  abort(): void {
    typeof this._requestDestroyer === 'function' && this._requestDestroyer();
    this._responseData = INITIAL_RESPONSE_DATA;
    this._handleFail('abort');
  };


  /**************
   *  RESPONSE  *
   **************/

  private _responseData: TResponseData = INITIAL_RESPONSE_DATA;

  /**
   * 处理响应
   * @param res 客户端返回的数据
   * @returns void
   */
  private _handleResponse = (res: TAdkRes): void => {
    if (this._isFailed) {
      return;
    }
    const { code, data } = res as TAdkRes;
    console.log('requestApp', this._requestData, 'appResponse', data);
    if (code === '0') {
      const { status, statusText = 'OK', headers = {}, body } = data as TAdkData;
      this._responseData = { status, statusText, headers, body };
      this._responseURL = this._requestData.url.split('#')[0];  // 简单处理

      // 模拟事件
      const contentLength = this.getResponseHeader('Content-Length') || 1;
      const progressEventOption = {
        lengthComputable: true,
        loaded: contentLength,
        total: contentLength,
      };
      this._changeReadyState(this.HEADERS_RECEIVED);
      this._changeReadyState(this.LOADING);
      this._emitProgressEvent('progress', progressEventOption);
      this._changeReadyState(this.DONE);
      this._emitProgressEvent('load', progressEventOption);
      this._emitProgressEvent('loadend', progressEventOption);
      this._requestData = {};
      return;
    } else {
      this._handleFail('error');
    }
  };

  private _handleTimeout = (): void => {
    this._handleFail('timeout');
  };

  private _handleFail = (failType: 'abort' | 'error' | 'timeout'): void => {
    if (this._isFailed) {
      return;
    }
    this._isFailed = true;
    this._changeReadyState(this.DONE);
    this._emitProgressEvent(failType);
    this._emitProgressEvent('loadend');
    this._requestData = {};
  };

  /**
   * Returns the numerical HTTP status code of response.
   * 参考：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status
   */
  get status(): number {
    return this._responseData.status || 0;
  };

  /**
   * Returns the response's status message as returned by the HTTP server, such as "OK" or "Not Found".
   * 参考：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/statusText
   */
  get statusText(): string {
    return this._responseData.statusText || '';
  };

  /**
   * Returns the response's body content.
   * 参考：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response
   * 注意：目前仅支持返回 Object、String 格式
   */
  get response(): any {
    return this._responseData.body || '';
  };

  /**
   * Returns the text received from a server following a request being sent.
   * 参考：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText
   */
  get responseText(): string | null {
    if (this._isFailed || this.readyState === this.UNSENT) {
      return null;
    } else if (this.responseType === '' || this.responseType === 'text') {
      const responseBody = this._responseData.body;
      return isPlainObject(responseBody) ? JSON.stringify(responseBody) : responseBody || '';
    } else {
      // Throws an "InvalidStateError" DOMException if responseType is not the empty string or "text".
      throw new DOMException('InvalidStateError');
    }
  };

  /**
   * Returns the response type.
   * Can be set to change the response type. Values are: the empty string (default), "arraybuffer", "blob", "document", "json", and "text".
   * When set: setting to "document" is ignored if current global object is not a Window object.
   * When set: throws an "InvalidStateError" DOMException if state is loading or done.
   * When set: throws an "InvalidAccessError" DOMException if the synchronous flag is set and current global object is a Window object.
   * 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/responseType
   */
  private _responseType: XMLHttpRequestResponseType = '';
  get responseType(): XMLHttpRequestResponseType {
    return this._responseType || '';
  };

  /**
   * Returns the serialized URL of the response or the empty string if the URL is null.
   * 参考：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseURL
   */
  private _responseURL: string = '';
  get responseURL(): string {
    return this._responseURL.split('#')[0];
  };

  /**
   * Returns all the response headers.
   * 参考：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
   * @returns A String representing all of the response's headers (except those whose field name 
   *   is Set-Cookie or Set-Cookie2) separated by CRLF, or null if no response has been received.
   *   If a network error happened, an empty string is returned.
   */
  getAllResponseHeaders(): string | null {
    if (this.readyState >= this.HEADERS_RECEIVED) {
      const headers = this._responseData.headers;
      return Object.keys(headers).map(name => `${name}: ${headers[name]}\r\n`).join('');
    } else {
      return null;
    }
  };

  /**
   * Returns the string containing the text of a particular header's value.
   * 参考：https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getResponseHeader
   * @param name A String indicating the name of the header you want to return the text value of.
   * @returns A String representing the header's text value, or null if either the response 
   *   has not yet been received or the header doesn't exist in the response.
   */
  getResponseHeader(name: string): string | null {
    const lowerCasedName = name.toLowerCase();
    const headers = this._responseData.headers;
    for (const itemName in headers) {
      if (itemName.toLowerCase() === lowerCasedName) {
        return headers[itemName];
      }
    }
    return null;
  };


  /*******************
   *  NOT SUPPORTED  *
   *******************/

  /**
   * Acts as if the `Content-Type` header value for a response is mime. (It does not change the header.)
   * Throws an "InvalidStateError" DOMException if state is loading or done.
   */
  overrideMimeType(mime: string): void {};

  /**
   * Returns the response as document.
   * Throws an "InvalidStateError" DOMException if responseType is not the empty string or "document".
   * 参考：https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/responseXML
   * TODO: 尚未实现
   */
  get responseXML(): Document | null {
    return null;
  };

  /**
   * Returns the associated XMLHttpRequestUpload object. It can be used to gather transmission information when data is transferred to a server.
   * TODO: 尚未实现
   */
  // readonly upload: XMLHttpRequestUpload;
};

/**
 * 启用客户端对 XHR 的代理
 * @returns 处理结果
 */
const enableXHRProxy = (): boolean => {
  if (isSupported('appXHR')) {
    WINDOW[ORIGINAL_XHR] = WebXHR;
    WINDOW.XMLHttpRequest = AppXHR;
    return true;
  }
  return false;
};

/**
 * 禁用客户端对 XHR 的代理
 * @returns 处理结果
 */
const disableXHRProxy = (): boolean => {
  WINDOW.XMLHttpRequest = WebXHR;
  delete WINDOW[ORIGINAL_XHR];
  return true;
};

export { AppXHR, WebXHR, enableXHRProxy, disableXHRProxy };
