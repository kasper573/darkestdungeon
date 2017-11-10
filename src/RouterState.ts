import {computed, observable, transaction} from "mobx";

export type PathTypes = Path | string;

export class RouterState  {
  @observable private history: Path[] = [new Path("")];
  @observable private currentIndex: number = 0;

  @observable public routes = new Map<string, Route>();

  @computed get path () {
    return this.history.length > 0 ?
      this.history[this.currentIndex] :
      undefined;
  }

  @computed get route () {
    return this.routes.get(this.path.value) || route404;
  }

  addRoutes (routes: {[key: string]: Route}) {
    transaction(() => {
      for (const key in routes) {
        this.addRoute(key, routes[key]);
      }
    });
  }

  addRoute (name: string, route: Route) {
    this.routes.set(name, route);
  }

  deleteRoute (name: string) {
    this.routes.delete(name);
  }

  goto (possiblePath: PathTypes) {
    const path = ensurePath(possiblePath);
    if (path.equals(this.path)) {
      return;
    }

    transaction(() => {
      // Overwrite future if there is any
      const lastIndex = this.history.length - 1;
      if (this.currentIndex < lastIndex) {
        this.history.splice(this.currentIndex + 1);
      }

      // Add new path and move to it
      this.history.push(path as Path);
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

export class Route {
  constructor (
    public component: any,
    public isMemorable: boolean = true
  ) {}
}

export class Path {
  constructor (
    public value: string,
    public args: any = {}
  ) {}

  equals (possibleOther: PathTypes) {
    const other = ensurePath(possibleOther);
    return other && other.value === this.value &&
      JSON.stringify(other.args) === JSON.stringify(this.args);
  }

  toString () {
    return this.value;
  }
}

function ensurePath (path: PathTypes): Path {
  if (typeof path === "string") {
    return new Path(path);
  }
  if (!path) {
    return new Path("");
  }
  return path as Path;
}

const route404 = new Route(
  ({path}: any) => `No route exists for path "${path}"`,
  false
);
