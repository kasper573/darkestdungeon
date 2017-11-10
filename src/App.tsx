import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {AppState} from "./AppState";
import {Router} from "./Router";
import {Popups} from "./Popups";
import {observer} from "mobx-react";
import {DevTools} from "./DevTools";
import {ambience, routes} from "./config";

@observer
export class App extends React.Component<{
  state: AppState,
  setupState?: boolean
}> {
  componentWillMount () {
    // HACK I'd like this to reside in main.tsx,
    // but due to route imports that makes HMR do a full page reload
    // as soon as any route changes, so this will do for now until
    // I figure out a better way to do it.
    // NOTE it's optional so tests don't get their state polluted
    if (this.props.setupState) {
      this.props.state.router.addRoutes(routes);
      this.props.state.router.goto("start");
      this.props.state.ambience.addDefinitions(ambience);
    }
  }

  render () {
    return (
      <div className={css(styles.app)}>
        <div className={css(styles.game)}>
          <Router state={this.props.state}/>
          <Popups state={this.props.state.popups}/>
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
