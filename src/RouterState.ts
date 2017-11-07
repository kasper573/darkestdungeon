import {computed, observable, transaction} from "mobx";

export class RouterState  {
  @observable private history: string[] = [];
  @observable private currentIndex: number = -1;

  @observable public routes = new Map<string, any>();

  @computed get location () {
    return this.history.length > 0 ?
      this.history[this.currentIndex] :
      undefined;
  }

  @computed get component () {
    return this.routes.get(this.location) || (() => `No route exists for location "${this.location}"`);
  }

  constructor (routes: {[key: string]: any}, startLocation?: string) {
    transaction(() => {
      for (const key in routes) {
        this.addRoute(key, routes[key]);
      }
      if (startLocation) {
        this.gotoLocation(startLocation);
      }
    });
  }

  addRoute (name: string, component: any) {
    this.routes.set(name, component);
  }

  removeRoute (name: string) {
    this.routes.delete(name);
  }

  gotoLocation (location: string) {
    if (this.location === location) {
      return;
    }

    transaction(() => {
      // Overwrite future if there is any
      const lastIndex = this.history.length - 1;
      if (this.currentIndex < lastIndex) {
        this.history.splice(this.currentIndex + 1);
      }

      // Add new location and move to it
      this.history.push(location);
      this.currentIndex++;
    });
  }

  goBack (offset: number = 1) {
    this.offset(-offset);
  }

  goForward (offset: number = 1) {
    this.offset(offset);
  }

  offset (amount: number) {
    const nextIndex = this.currentIndex + amount;
    const lastIndex = this.history.length - 1;
    if (nextIndex >= 0 && lastIndex <= lastIndex) {
      this.currentIndex = nextIndex;
    }
  }
}
