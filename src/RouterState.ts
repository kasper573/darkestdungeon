import {computed, observable, transaction} from "mobx";

export type PathTypes = Path | string;

export class RouterState  {
  @observable private history: Path[] = [];
  @observable private currentIndex: number = -1;

  @observable public routes = new Map<string, any>();

  @computed get path () {
    return this.history.length > 0 ?
      this.history[this.currentIndex] :
      undefined;
  }

  @computed get component () {
    return this.routes.get(this.path.value) || (() => `No route exists for path "${this.path}"`);
  }

  constructor (routes: {[key: string]: any}, startPath?: string) {
    transaction(() => {
      for (const key in routes) {
        this.addRoute(key, routes[key]);
      }
      if (startPath) {
        this.goto(startPath);
      }
    });
  }

  isRouteMemorable (path: Path) {
    // TODO look up for route of path
    return !(path.equals("start") || path.equals("loading"));
  }

  addRoute (name: string, component: any) {
    this.routes.set(name, component);
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
