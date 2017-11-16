import * as React from "react";
import { StyleSheet} from "aphrodite";
import {ItemInfo} from "../state/StaticState";
import {commonStyles} from "../config/styles";
import {TooltipArea, TooltipSide} from "../lib/TooltipArea";
import {ItemBreakdown} from "./ItemBreakdown";

export class ItemSlot extends React.Component<{
  item?: ItemInfo,
  onClick?: () => void,
  style?: any
}> {
  render () {
    const breakdown = this.props.item && (
      <ItemBreakdown/>
    );

    return (
      <TooltipArea
        side={TooltipSide.Above}
        tip={breakdown}
        classStyle={[styles.itemSlot, commonStyles.boxBorder]}
        style={this.props.style}>
        <span style={{flex: 1}} onClick={this.props.onClick}>
          {this.props.item ? this.props.item.name : undefined}
        </span>
      </TooltipArea>
    );
  }
}

const styles = StyleSheet.create({
  itemSlot: {
    flex: 1,
    minHeight: 30,
    backgroundColor: "black",
    fontSize: 10,
    justifyContent: "center",
    alignItems: "center"
  }
});
