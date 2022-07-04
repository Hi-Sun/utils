// import 'whatwg-fetch';  // import Headers、Request、Response polyfill
import { callApp } from '../bridge';
// import { TAdkData } from '../types';
import getFullUrl from '../utils/getFullUrl';
import isSupported from '../utils/isSupported';
import { isPlainObject } from '../utils/typeof';

const WINDOW = (typeof window !== 'undefined' ? window : {}) as Window;
const NATIVE_FETCH_REGEXP = /^function fetch\(\)\s+\{\s+\[native code\]\s+\}$/;
const ORIGINAL_FETCH = '_originalFetch';
const ERROR_MESSAGES: TAdkData = {
  'iOS:-1020': '数据连接被禁用，请检查系统设置。',
  'iOS:-1202': 'SSL证书验证失败。',
};

/**
 * 判断输入是否是 Web 原生的 fetch
 * @param anyFetch 用于判断的 fetch
 * @returns boolean
 */
const isNativeFetch = (anyFetch: any = WINDOW.fetch): boolean => {
  return anyFetch && NATIVE_FETCH_REGEXP.test(anyFetch.toString());
}

/**
 * Web 原来的 fetch
 * 注意，这个 fetch 有可能被其他三方库修改过，未必是 Web 原生的，
 * 如果想判断是否是 Web 原生的 fetch，请使用 isNativeFetch。
 */
const webFetch = (WINDOW[ORIGINAL_FETCH] || WINDOW.fetch) as Window['fetch'];

/**
 * 通过客户端代理 fetch 请求
 * 参考：
 *  - https://fetch.spec.whatwg.org/
 *  - https://github.com/github/fetch
 *  - https://developer.mozilla.org/en-US/docs/Web/API/fetch
 *  - https://developer.mozilla.org/zh-CN/docs/Web/API/fetch
 * @param input 参考上述文档
 * @param init 参考上述文档
 * @param appOptions 客户端代理配置
 * @returns Promise，resolve 时回传 Response 对象
 */
const appFetch = (input: RequestInfo, init?: RequestInit, appOptions?: TAdkData): Promise<Response | TAdkData> => {
  const request = new Request(input, init);  // 统一输入
  const { url, method } = request;
  const {
    privateHeaders = [],
    encrypt = 'none',
    policy = 0,
  } = appOptions || {};

  // 放行 GET、HEAD 请求
  if (method === 'GET' || method === 'HEAD') {
    return webFetch(input, init);
  }

  // Request headers
  const headers: TAdkData = {};
  request.headers.forEach((value, name) => {
    headers[name] = value;
  });

  // request data 参考：
  // http://wiki.jindidata.com/pages/viewpage.action?pageId=46999821#id-%E4%BC%81%E6%9C%8DJSBridgeactions-request
  const requestData: TAdkData = {
    url: getFullUrl(url),
    method,
    headers,
    privateHeaders, // 敏感、隐私的 headers
    encrypt, // 数据加密策略，可选值：none、request、response、all
    policy, // 资源获取策略，目前仅支持 0 和 3，参考：http://wiki.jindidata.com/pages/viewpage.action?pageId=48563060
  };

  return new Promise(async (resolve, reject) => {
    // Abort
    if (request.signal && request.signal.aborted) {
      reject({
        code: '2',
        message: 'Request aborted.',
      });
      return;
    }

    // Request body
    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
      await request
        .json()
        .then((body) => {
          requestData.body = body;
        })
        .catch(() => {});
    }

    callApp('request', {
      ...requestData,
      success: (res = {}) => {
        console.log('requestApp', requestData, 'appResponse', res);
        const { status, statusText = 'OK', headers = {}, body } = res;
        if (isPlainObject(body)) {
          const responseHeaders = new Headers();
          Object.keys(headers).forEach(name => {
            responseHeaders.append(name, headers[name]);
          });
          const responseObject = {
            status,  // (number) - HTTP response code in the 100–599 range
            statusText,  // (String) - Status text as reported by the server, e.g. "Unauthorized"
            ok: status >= 200 && status < 300,
            url: requestData.url,  // 简单处理
            headers: responseHeaders,
            json: () => Promise.resolve(body),
            text: () => Promise.resolve(JSON.stringify(body)),
          };
          resolve({
            ...responseObject,
            clone: () => responseObject,
          });
        } else {
          resolve(
            new Response(body || '', {
              status,
              statusText,
              headers,
            })
          );
        }
      },
      fail: (err = {}) => {
        console.log('requestApp', requestData, 'appResponse', err);
        // TODO: 模拟 fetch 错误
        const { code = '-1', msg = '请稍后重试。' } = err;
        reject({
          code,
          message: `网络异常，${ERROR_MESSAGES['' + code] || msg} #${code}`,
        });
      },
    });
  });
};

/**
 * 启用客户端对 fetch 的代理
 * @returns 处理结果
 */
const enableFetchProxy = (): boolean => {
  if (isSupported('appFetch')) {
    WINDOW[ORIGINAL_FETCH] = webFetch;
    WINDOW.fetch = appFetch;
    return true;
  }
  return false;
};

/**
 * 禁用客户端对 fetch 的代理
 * @returns 处理结果
 */
const disableFetchProxy = (): boolean => {
  WINDOW.fetch = webFetch;
  delete WINDOW[ORIGINAL_FETCH];
  return true;
};

export { appFetch, webFetch, isNativeFetch, enableFetchProxy, disableFetchProxy };
