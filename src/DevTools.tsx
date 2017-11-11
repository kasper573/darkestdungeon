import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {AppState} from "./AppState";
import {Stats} from "./Stats";

export class DevTools extends React.Component<{state: AppState}> {
  pathSelect: HTMLSelectElement;

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
        <select ref={(node) => this.pathSelect = node}
                className={css(styles.paths)}
                onChange={() => this.gotoSelectedPath()}>
          {pathOptions}
        </select>
        <button style={{width: 50}} onClick={() => this.gotoSelectedPath()}>
          Go
        </button>
        <button style={{width: 50}} onClick={() => this.props.state.save()}>
          Save
        </button>
        <button style={{width: 50}} onClick={() => this.props.state.load()}>
          Load
        </button>
        {!state.isRunningJest && <Stats/>}
      </div>
    );
  }

  gotoSelectedPath () {
    this.props.state.router.goto(this.pathSelect.value);
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
