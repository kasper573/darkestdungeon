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
import {RouterPopups} from "./RouterPopups";
import {fonts} from "../assets/fonts";
import {grid} from "./config/Grid";
import {InputRoot} from "./state/InputState";

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

  private disposeReactions: IReactionDisposer;
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
  }

  componentDidMount () {
    // Let the top popup layer be the input layer
    this.disposeReactions = reaction(
      () => this.props.state.popups.top,
      (topPopup) => this.inputRoot.inputHandler.layerId = topPopup ? topPopup.id : null,
      true
    );
  }

  componentWillUnmount () {
    this.disposeReactions();
  }

  render () {
    return (
      <InputRoot
        ref={(ir) => this.inputRoot = ir}
        className={css(styles.app)}>
        <div className={css(styles.arc)} style={this.arcStyle}>
          <div className={css(styles.game)} style={this.gameStyle}>
            <Router router={this.props.state.router}/>
            <RouterPopups
              popups={this.props.state.popups}
              router={this.props.state.router}
            />
            <PopupList
              popups={this.props.state.popups}
              portalNodeRef={(node) => this.props.state.portalNode = node}
            />
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
    width: grid.xSpan(grid.columns),
    height: grid.ySpan(grid.rows),
    overflow: "hidden",
    background: "#222",
    color: "white"
  }
});
