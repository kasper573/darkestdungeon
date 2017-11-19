import {computed, observable, transaction, when} from "mobx";
import {custom, serializable} from "serializr";
import {AmbienceDefinition} from "./AmbienceState";

export type PathTypes = Path | string;
const noop: () => null = () => null;

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
    return this.getRouteForPath(this.path);
  }

  getRouteForPath (path: Path) {
    let route = this.routes.get(path.root);
    if (!route) {
      return route404;
    }

    route.path = new Path(path.root);
    const childPaths = path.parts.slice(1);
    while (childPaths.length) {
      const childPath = childPaths.shift();
      const child = route.children[childPath];
      if (!child) {
        route = route404.inherit(route, childPath);
        break;
      } else {
        route = child.inherit(route, childPath);
      }
    }

    return route;
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
    let nextPath = ensurePath(possiblePath);
    if (nextPath.equals(this.path)) {
      return Promise.resolve();
    }

    const destinationPath = nextPath;

    // Go through potential rerouting
    let fromPath = this.path;
    let newPath = nextPath;
    while (newPath) {
      nextPath = newPath;
      const rerouter = this.getRouteForPath(nextPath).rerouter;
      newPath = rerouter ? rerouter(fromPath, nextPath) : null;
      fromPath = nextPath;
    }

    transaction(() => {
      // Overwrite future if there is any
      const lastIndex = this.history.length - 1;
      if (this.currentIndex < lastIndex) {
        this.history.splice(this.currentIndex + 1);
      }

      // Add new path and move to it
      this.history.push(nextPath as Path);
      this.currentIndex++;
    });

    // Return a promise that resolves when we
    // reach the destination (in case of reroutes)
    return new Promise((resolve) => {
      when(() => this.path.value === destinationPath.value, resolve);
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

export class RouteConstructionProps {
  component: any;
  isMemorable?: boolean;
  music?: (state?: any, path?: Path) => IHowlProperties;
  ambience?: (state?: any, path?: Path) => AmbienceDefinition;
  children?: {[key: string]: Route};
  rerouter?: (fromPath: Path, toPath: Path) => Path;
}

export class Route extends RouteConstructionProps {
  private constructionProps: RouteConstructionProps;

  // Created by inherit
  public path?: Path;
  public parent?: Route;
  public root: Route = this;

  constructor (props: RouteConstructionProps) {
    super();

    this.constructionProps = props;

    this.component = props.component;
    this.isMemorable = props.isMemorable !== undefined ? props.isMemorable : true;
    this.children = props.children || {};
    this.rerouter = props.rerouter;

    this.ambience = props.ambience ?
      function () {
        let res;
        if (props.ambience) {
          res = props.ambience.apply(this, arguments);
          if (typeof res === "string") {
            return new AmbienceDefinition({src: res});
          }
        }
        return res;
      } : noop;

    this.music = props.music ?
      function () {
        let res;
        if (props.music) {
          res = props.music.apply(this, arguments);
          if (typeof res === "string") {
            return {src: res};
          }
        }
        return res;
      } : noop;
  }

  inherit (parent: Route, childPath: string) {
    const cascaded = new Route(this.constructionProps);
    cascaded.root = parent.root;
    cascaded.parent = parent;
    cascaded.path = new Path(
      parent.path.parts.concat(childPath).join(Path.separator)
    );
    if (cascaded.music === noop) {
      cascaded.music = parent.music;
    }
    if (cascaded.ambience === noop) {
      cascaded.ambience = parent.ambience;
    }
    return cascaded;
  }
}

export class Path {
  public static separator: string = "/";

  @serializable public value: string;

  @serializable(custom((val) => val, (val) => val))
  public args: any;

  get parts () {
    return this.value.split(Path.separator);
  }

  get root () {
    return this.parts[0];
  }

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
