import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {AppState} from "./state/AppState";
import {Router} from "./Router";
import {PopupList} from "./PopupList";
import {observer} from "mobx-react";
import {DevTools} from "./DevTools";
import {routes} from "./config/routes";
import {SizeObserver} from "./lib/SizeObserver";
import {computed, IReactionDisposer, reaction} from "mobx";
import {appStateContext} from "./AppStateComponent";
import {fonts} from "../assets/fonts";
import {grid} from "./config/Grid";
import {InputRoot} from "./state/InputState";
import {GridOverlay} from "./GridOverlay";
import {commonColors} from "./config/styles";
import {Path} from "./state/types/Path";
import {Route} from "./state/types/Route";
import {PopupAlign, PopupHandle} from "./state/PopupState";
import {Popup} from "./ui/Popups";

@observer
export class App extends React.Component<{
  state: AppState,
  setupRoutes?: boolean
}> {
  static childContextTypes = appStateContext;
  getChildContext () {
    return {
      state: this.props.state
    };
  }

  private reactionDisposers: IReactionDisposer[] = [];
  private routePopup: PopupHandle;
  private inputRoot: InputRoot;

  /**
   * The style required to create the black borders around
   * the game to enforce the aspect ratio configured in UIState.
   */
  @computed get arcStyle () {
    const arcSize = this.props.state.bounds.arcSize;
    return {
      paddingTop: arcSize.height,
      paddingRight: arcSize.width,
      paddingLeft: arcSize.width,
      paddingBottom: arcSize.height
    };
  }

  @computed get gameStyle () {
    return {
      transformOrigin: "0 0",
      transform: `scale(${this.props.state.bounds.scale})`
    };
  }

  componentWillMount () {
    // HACK I'd like this to reside in main.tsx,
    // but due to route imports that makes HMR do a full page reload
    // as soon as any route changes, so this will do for now until
    // I figure out a better way to do it.
    // NOTE it's optional so tests don't get their state polluted
    if (this.props.setupRoutes) {
      this.props.state.router.addRoutes(routes);
    }

    // Display child routes as popups
    this.reactionDisposers.push(
      reaction(
        () => [
          this.props.state.router.path,
          this.props.state.router.route
        ],
        ([path, route]: [Path, Route]) => {
          if (path.parts.length > 1) {
            this.showRoutePopup(route);
          } else if (this.routePopup) {
            this.routePopup.close();
            delete this.routePopup;
          }
        }
      )
    );
  }

  componentDidMount () {
    // Let the top popup layer be the input layer
    this.reactionDisposers.push(
      reaction(
        () => this.props.state.popups.top,
        (topPopup) => this.inputRoot.inputHandler.layerId = topPopup ? topPopup.id : null,
        true
      )
    );
  }

  componentWillUnmount () {
    while (this.reactionDisposers.length) {
      this.reactionDisposers.pop()();
    }
  }

  private showRoutePopup (route: Route) {
    this.routePopup = this.props.state.popups.show({
      align: PopupAlign.TopLeft,
      position: {x: 25, y: 25},
      id: "routePopup",
      onClose: () => this.props.state.router.goto(route.path.root),
      content: (
        <Popup>
          {React.createElement(route.component, {path: route.path})}
        </Popup>
      )
    });
  }

  render () {
    return (
      <InputRoot
        ref={(ir) => this.inputRoot = ir}
        className={css(styles.app)}>
        <div className={css(styles.arc)} style={this.arcStyle}>
          <div className={css(styles.game)} style={this.gameStyle}>
            <Router router={this.props.state.router}/>
            <PopupList
              popups={this.props.state.popups}
              portalNodeRef={(node) => this.props.state.portalNode = node}
            />
            {this.props.state.showGridOverlay && <GridOverlay/>}
          </div>
          <SizeObserver
            onSizeChanged={(size) => this.props.state.bounds.realSize = size}
          />
        </div>
        <DevTools />
      </InputRoot>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    fontFamily: fonts.Default,
    width: "100%",
    height: "100%",
    overflow: "hidden"
  },

  arc: {
    flex: 1,
    overflow: "hidden",
    background: "black"
  },

  game: {
    width: grid.outerWidth,
    height: grid.outerHeight,
    overflow: "hidden",
    background: "#ab36ff",
    color: commonColors.lightGray,
    fontSize: grid.fontSize(0.5)
  }
});
