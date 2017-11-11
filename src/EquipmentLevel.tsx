import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {EquipmentType} from "./config/general";

export class EquipmentLevel extends React.Component<{
  type: EquipmentType,
  level: number
}> {
  render () {
    return (
      <div className={css(styles.equipmentLevel)}>
        <span>[{this.props.type}]</span>
        <span>{this.props.level}</span>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  equipmentLevel: {
    background: "gray",
    padding: 5,
    flexDirection: "row"
  }
});
