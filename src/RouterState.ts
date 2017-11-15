import {computed, observable, transaction} from "mobx";
import {serializable} from "serializr";
import {AmbienceDefinition} from "./AmbienceState";

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

export type RouteConstructionProps = {
  component: any;
  isMemorable?: boolean;
  music?: (state?: any, path?: Path) => IHowlProperties | string;
  ambience?: (state?: any, path?: Path) => AmbienceDefinition;
};

export class Route {
  public component: any;
  public isMemorable: boolean = true;
  public music: (state?: any, path?: Path) => IHowlProperties;
  public ambience: (state?: any, path?: Path) => AmbienceDefinition;

  constructor (props: RouteConstructionProps) {
    this.component = props.component;
    this.isMemorable = props.isMemorable;
    this.ambience = function () {
      let res;
      if (props.ambience) {
        res = props.ambience.apply(this, arguments);
        if (typeof res === "string") {
          return new AmbienceDefinition({src: res});
        }
      }
      return res;
    };

    this.music = function () {
      let res;
      if (props.music) {
        res = props.music.apply(this, arguments);
        if (typeof res === "string") {
          return {src: res};
        }
      }
      return res;
    };
  }
}

export class Path {
  @serializable public value: string;
  public args: any;

  constructor (
    value: string = "",
    args: any = {}
  ) {
    this.value = value;
    this.args = args;
  }

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

const route404 = new Route({
  component: ({path}: any) => `No route exists for path "${path}"`,
  isMemorable: false
});
