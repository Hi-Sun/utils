import * as fetch from './fetch';
import * as sendBeacon from './sendBeacon';
import * as xhr from './xhr';
import { networkPolicy } from '../utils/client';

const enableProxy = () => {
  console.log('ADK.enableProxy()');
  fetch.enableFetchProxy();
  sendBeacon.enableSendBeaconProxy();
  xhr.enableXHRProxy();
};

const disableProxy = () => {
  console.log('ADK.disableProxy()');
  fetch.disableFetchProxy();
  sendBeacon.disableSendBeaconProxy();
  xhr.disableXHRProxy();
};

const proxy = {
  ...fetch,
  ...sendBeacon,
  ...xhr,
  enableProxy,
  disableProxy,
};

networkPolicy === 1 && enableProxy();

export default proxy;
