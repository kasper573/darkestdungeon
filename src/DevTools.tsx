import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {AppState} from "./AppState";
import {Stats} from "./Stats";

export class DevTools extends React.Component<{state: AppState}> {
  render () {
    const state = this.props.state;
    const router = state.router;
    const pathOptions = [];
    for (const path of router.routes.keys()) {
      pathOptions.push(
        <option key={path} value={path}>{path}</option>
      );
    }

    return (
      <div className={css(styles.container)}>
        <select className={css(styles.paths)} onChange={(e) => this.onPathChanged(e)}>
          {pathOptions}
        </select>
        {!state.isRunningJest && <Stats/>}
      </div>
    );
  }

  onPathChanged (e: React.ChangeEvent<HTMLSelectElement>) {
    this.props.state.router.goto(e.target.value);
  }
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: "row"
  },

  paths: {
    flex: 1,
    flexDirection: "row"
  },

  path: {
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center"
  }
});
