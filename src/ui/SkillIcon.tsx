import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {TooltipArea} from "../lib/TooltipArea";
import {todo} from "../config/general";

export class SkillIcon extends React.Component<{
  unlocked?: boolean,
  selected?: boolean,
  level?: number
}> {
  render () {
    const lockSymbol = !this.props.unlocked && (
      <span>L</span>
    );

    const selectionIndicator = this.props.selected && (
      <div className={css(styles.selectionIndicator)}/>
    );

    const levelIndicator = this.props.level && (
      <span className={css(styles.levelIndicator)}>
          {this.props.level}
        </span>
    );

    return (
      <TooltipArea
        tip={todo}
        classStyle={styles.container}>
        {lockSymbol}
        {levelIndicator}
        {selectionIndicator}
      </TooltipArea>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    background: "rgb(0, 0, 60)",
    opacity: 0.8,
    minWidth: 30,
    minHeight: 30,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 2,
    ":last-child": {
      marginRight: 0
    },

    ":hover": {
      opacity: 1
    }
  },

  selectionIndicator: {
    position: "absolute",
    top: 0, right: 0, bottom: 0, left: 0,
    border: "2px solid gold",
    boxShadow: "inset 0 0 10px #000000"
  },

  levelIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "black",
    color: "white",
    padding: 2
  }
});
