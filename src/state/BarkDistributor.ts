import {randomizeItem} from "../lib/Helpers";

export type BarkCallback = (bark: string) => Promise<any>;

export class BarkDistributor {
  private isActive: boolean;
  private timeoutId: any;
  private subscriptions: BarkSubscription[] = [];

  public barks: string[] = [];

  constructor (
    public timeoutMin: number = 5 * 1000,
    public timeoutMax: number = 60 * 2 * 1000
  ) {}

  subscribe (callback: BarkCallback) {
    const sub = new BarkSubscription(this, callback);
    this.subscriptions.push(sub);
    return sub;
  }

  unsubscribe (sub: BarkSubscription) {
    const index = this.subscriptions.indexOf(sub);
    if (index !== -1) {
      this.subscriptions.splice(index, 1);
    }
  }

  start () {
    this.stop();
    this.isActive = true;
    this.queueBark();
  }

  stop () {
    clearTimeout(this.timeoutId);
    this.isActive = false;
  }

  private queueBark () {
    if (!this.isActive) {
      return;
    }

    const timeout = this.timeoutMin + (this.timeoutMax - this.timeoutMin) * Math.random();
    this.timeoutId = setTimeout(() => this.publishBark(), timeout);
  }

  private publishBark () {
    if (this.subscriptions.length && this.barks.length) {
      const sub = randomizeItem(this.subscriptions);
      const bark = randomizeItem(this.barks);
      sub.callback(bark).then(() => this.queueBark());
    }
  }
}

export class BarkSubscription {
  constructor (
    private distributor: BarkDistributor,
    public callback: BarkCallback
  ) {}

  unsubscribe () {
    this.distributor.unsubscribe(this);
  }
}
