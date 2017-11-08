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

@observer
export class App extends React.Component<{state: AppState}> {
  componentWillMount () {
    // HACK Initializing here will make testing problematic
    this.props.state.initialize(
      new RouterState(routes, "start"),
      new AmbienceState(ambienceDefinitions),
      new MusicState(),
      new PopupState()
    );
  }

  render () {
    return (
      <div className={css(styles.container)}>
        <Router state={this.props.state}/>
        <Popups state={this.props.state.popups}/>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Ubuntu",
    width: "100%",
    height: "100%",
    background: "black",
    color: "white",
    overflow: "hidden"
  }
});
