import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {AppStateComponent} from "./AppStateComponent";

export class CurioModel extends AppStateComponent {
  render () {
    return (
      <div className={css(styles.model)}
           onClick={() => this.appState.popups.show("Curio interaction")}>
        Curio
      </div>
    );
  }
}

const styles = StyleSheet.create({
  model: {
    background: "purple",
    padding: 3,
    margin: 3,
    border: "2px solid gray"
  }
});
