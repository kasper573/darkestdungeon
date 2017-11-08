import {computed, observable, transaction} from "mobx";

type RoutePath = string;

export class RouterState  {
  @observable private history: Location[] = [];
  @observable private currentIndex: number = -1;

  @observable public routes = new Map<RoutePath, any>();

  @computed get location () {
    return this.history.length > 0 ?
      this.history[this.currentIndex] :
      undefined;
  }

  @computed get component () {
    return this.routes.get(this.location.path) || (() => `No route exists for location "${this.location}"`);
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

  gotoLocation (location: Location | string) {
    if (typeof location === "string") {
      location = new Location(location);
    }

    if ((location as Location).equals(this.location)) {
      return;
    }

    transaction(() => {
      // Overwrite future if there is any
      const lastIndex = this.history.length - 1;
      if (this.currentIndex < lastIndex) {
        this.history.splice(this.currentIndex + 1);
      }

      // Add new location and move to it
      this.history.push(location as Location);
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

export class Location {
  constructor (
    public path: RoutePath,
    public args: any = {}
  ) {}

  equals (other: Location) {
    return other && other.path === this.path &&
      JSON.stringify(other.args) === JSON.stringify(this.args);
  }

  toString () {
    return this.path;
  }
}
