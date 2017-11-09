import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {AppState} from "./AppState";
import {Router} from "./Router";
import {Popups} from "./Popups";
import {MusicState} from "./MusicState";
import {AmbienceState} from "./AmbienceState";
import {RouterState} from "./RouterState";
import {ambienceDefinitions, routes} from "./config";
import {PopupState} from "./PopupState";
import {observer} from "mobx-react";
import {DevTools} from "./DevTools";
import {ProfileState} from "./ProfileState";

@observer
export class App extends React.Component<{state: AppState}> {
  componentWillMount () {
    // HACK Initializing here will make testing problematic
    this.props.state.initialize(
      new RouterState(routes, "start"),
      new AmbienceState(ambienceDefinitions),
      new MusicState(),
      new PopupState(),
      new ProfileState()
    );
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
