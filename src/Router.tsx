import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {AppState} from "./AppState";
import {observer} from "mobx-react";
import {DevTools} from "./DevTools";

// NOTE I'm not sure about this structure
import {ambienceDefinitions, routes} from "./config";
import {AmbienceState} from "./AmbienceState";
import {RouterState} from "./RouterState";

@observer
export class Router extends React.Component<{state: AppState}> {
  componentWillMount () {
    // HACK This will make testing problematic
    this.props.state.initialize(
      new RouterState(routes, "start"),
      new AmbienceState(ambienceDefinitions)
    );
  }

  render () {
    const state = this.props.state;
    const routeElement = React.createElement(state.router.component, {state});

    return (
      <div className={css(styles.base)}>
        {routeElement}
        <DevTools router={state.router}/>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    fontFamily: "Ubuntu",
    width: "100%",
    height: "100%",
    background: "black",
    color: "white",
    overflow: "hidden"
  }
});
