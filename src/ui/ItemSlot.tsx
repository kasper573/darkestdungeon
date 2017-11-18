import * as React from "react";
import { StyleSheet} from "aphrodite";
import {commonStyles} from "../config/styles";
import {TooltipArea, TooltipSide} from "../lib/TooltipArea";
import {StatsTextList} from "./StatsText";
import {ItemLevel} from "./ItemLevel";
import {Item} from "../state/types/Item";

export class ItemSlot extends React.Component<{
  item?: Item,
  onClick?: () => void,
  style?: any
}> {
  render () {
    const item = this.props.item;
    const breakdown = item && (
      <div>
        <ItemLevel key={item.id} type={item.info.type} level={item.level}/>
        <StatsTextList stats={this.props.item.info.stats.nonNeutral}/>
      </div>
    );

    return (
      <TooltipArea
        side={TooltipSide.Above}
        tip={breakdown}
        classStyle={[styles.itemSlot, commonStyles.boxBorder]}
        style={this.props.style}>
        <span style={{flex: 1}} onClick={this.props.onClick}>
          {this.props.item ? this.props.item.info.name : undefined}
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
