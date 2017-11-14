import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {PopupState} from "./PopupState";

export class CurioModel extends React.Component<{
  popups: PopupState
}> {
  render () {
    return (
      <div className={css(styles.model)}
           onClick={() => this.props.popups.show("Curio interaction")}>
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
