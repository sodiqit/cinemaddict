import bind from 'bind-decorator';

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
type Observer = (...args: any[]) => void;
type ObserversObj = { [key: string]: Observer[] };

export interface IObservable {
  subscribe(callback: Observer, type: string): void,
  unsubscribe(callback: Observer, type: string): void,
  notify(type: string, data?: unknown): void,
}

export class Observable implements IObservable {
  private observers: ObserversObj;

  constructor() {
    this.observers = {};
  }

  @bind
  subscribe(callback: Observer, type: string): void {
    if (this.observers[type] instanceof Array) {
      this.observers[type].push(callback);
    } else {
      this.observers[type] = [callback];
    }
  }

  @bind
  unsubscribe(callback: Observer, type: string): void {
    this.observers[type] = this.observers[type].filter((observer) => observer !== callback);
  }

  @bind
  notify(type: string, data?: unknown): void {
    if (!this.observers[type]) {
      throw new Error(`no observer for this ${type}`);
    }
    this.observers[type].forEach((observer) => observer(data));
  }
}
