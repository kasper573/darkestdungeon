import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {ItemType} from "../state/StaticState";

export class ItemLevel extends React.Component<{
  type: ItemType,
  level: number,
  classStyle?: any
}> {
  render () {
    return (
      <div className={css(styles.itemLevel, this.props.classStyle)}>
        <span>[{this.props.type}]</span>
        <span>{this.props.level}</span>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  itemLevel: {
    background: "rgb(0, 0, 60)",
    padding: 5,
    flexDirection: "row"
  }
});
