// 捕获大盘监控到的白屏问题
// http://172.28.84.202:8888/%E6%9F%A5%E5%85%AC%E5%8F%B8264514c008f730a6.png
// Application error: a client-side exception has occurred (see the browser console for more information).

import multiTry from './multiTry.js';
import reportSentry from './reportSentry';

const ERROR_KEYWORDS = 'Application error: a client-side exception has occurred';
let hasCaptured = false;

const doCapture = () => {
  return new Promise((resolve, reject) => {
    if (hasCaptured) {
      resolve(true);
    } else if (window.document.body.innerText.indexOf(ERROR_KEYWORDS) >= 0) {
      reportSentry('client-side exception has occurred', {
        level: 'fatal',
      });
      hasCaptured = true;
      resolve(true);
    } else {
      reject(false);
    }
  });
};

const multiCapture = () => {
  multiTry(doCapture, 2, 50).catch(() => {
    // do nothing.
  });
};

const captureWhiteScreenException = () => {
  if (typeof window !== 'undefined') {
    try {
      // 尝试在 DOMContentLoaded、load、LCP 时捕获异常
      // window.document?.addEventListener('DOMContentLoaded', multiCapture);
      window.onload = multiCapture;
      new PerformanceObserver(multiCapture).observe({
        type: 'largest-contentful-paint',
        buffered: true,
      });
    } catch (e) {
      // do nothing.
    }
  }
};

export default captureWhiteScreenException;
