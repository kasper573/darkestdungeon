import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {AppStats} from "./ui/AppStats";
import {AppStateComponent} from "./AppStateComponent";
import {observer} from "mobx-react";

@observer
export class DevTools extends AppStateComponent {
  pathSelect: HTMLSelectElement;

  render () {
    const pathOptions = [];
    for (const path of this.appState.router.routes.keys()) {
      pathOptions.push(
        <option key={path} value={path}>{path}</option>
      );
    }

    return (
      <div className={css(styles.container)}>
        <div className={css(styles.currentPath)}>
          {this.appState.router.path.toString()}
        </div>
        <select ref={(node) => this.pathSelect = node}
                className={css(styles.paths)}
                onChange={() => this.gotoSelectedPath()}>
          {pathOptions}
        </select>
        <button onClick={() => this.gotoSelectedPath()}>
          Go
        </button>
        <button onClick={() => this.appState.save()}>
          Save
        </button>
        <button onClick={() => this.appState.load()}>
          Load
        </button>
        <button onClick={() => this.appState.toggleGridOverlay()}>
          Grid
        </button>
        {!this.appState.isRunningJest && <AppStats/>}
      </div>
    );
  }

  gotoSelectedPath () {
    this.appState.router.goto(this.pathSelect.value);
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

  currentPath: {
    padding: 3,
    justifyContent: "center",
    alignItems: "center"
  }
});
