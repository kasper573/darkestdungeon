import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {AppState} from "./AppState";
import {Router} from "./Router";
import {PopupList} from "./PopupList";
import {observer} from "mobx-react";
import {DevTools} from "./DevTools";
import {routes} from "./config/routes";

@observer
export class App extends React.Component<{
  state: AppState,
  setupRoutes?: boolean
}> {
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
        <div className={css(styles.game)}>
          <Router state={this.props.state}/>
          <PopupList state={this.props.state.popups}/>
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
    background: "#999",
    overflow: "hidden"
  },

  game: {
    flex: 1,
    overflow: "hidden",
    background: "black",
    color: "white"
  }
});