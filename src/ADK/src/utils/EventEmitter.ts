// import { TAdkData, TAdkHandler } from '../types';

class EventEmitter {
  private _actionHandlers: { [action: string]: TAdkHandler[] };

  constructor () {
    this._actionHandlers = {};
  }

  // 触发 action handler
  public emit (action: string, data: TAdkData) {
    const handlers = this._actionHandlers[action] || [];
    handlers.forEach((handler: TAdkHandler) => {
      handler && handler.call(handler, data);
    });
  };

  // 注册 action handler
  public on (action: string, handler: TAdkHandler) {
    const handlers = this._actionHandlers[action] || [];
    handlers.push(handler);
    this._actionHandlers[action] = handlers;
    return () => this.off(action, handler);
  };

  // 销毁 action handler
  public off (action: string, handler?: TAdkHandler) {
    if (handler) {
      const handlers = this._actionHandlers[action];
      if (Array.isArray(handlers)) {
        this._actionHandlers[action] = handlers.filter(item => item !== handler);
      }
    } else {
      delete this._actionHandlers[action];
    }
  };

  // 注册一次性 action handler
  public once (action: string, handler: TAdkHandler) {
    const newHandler = (data: TAdkData = {}) => {
      handler && handler.call(handler, data);
      this.off(action, newHandler);
    };
    return this.on(action, newHandler);
  };
}

export default EventEmitter;
