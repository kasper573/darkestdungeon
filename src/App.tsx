import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {AppState} from "./AppState";
import {Router} from "./Router";
import {PopupList} from "./PopupList";
import {observer} from "mobx-react";
import {DevTools} from "./DevTools";
import {routes} from "./config/routes";
import {SizeObserver} from "./SizeObserver";
import {computed} from "mobx";

@observer
export class App extends React.Component<{
  state: AppState,
  setupRoutes?: boolean
}> {
  /**
   * The style required to create the black borders around
   * the game to enforce the aspect ratio configured in UIState.
   */
  @computed get arcStyle () {
    const arcSize = this.props.state.ui.arcSize;
    return {
      paddingTop: arcSize.height,
      paddingRight: arcSize.width,
      paddingLeft: arcSize.width,
      paddingBottom: arcSize.height
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

  render () {
    return (
      <div className={css(styles.app)}>
        <div className={css(styles.arc)} style={this.arcStyle}>
          <div className={css(styles.game)}>
            <Router state={this.props.state}/>
            <PopupList
              state={this.props.state.popups}
              uiState={this.props.state.ui}
            />
          </div>
          <SizeObserver
            onSizeChanged={(size) => this.props.state.ui.appSize = size}
          />
        </div>
        <DevTools state={this.props.state}/>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    fontFamily: "Ubuntu",
    width: "100%",
    height: "100%",
    overflow: "hidden"
  },

  arc: {
    flex: 1,
    overflow: "hidden",
    background: "black",
  },

  game: {
    flex: 1,
    overflow: "hidden",
    background: "#222",
    color: "white"
  }
});
