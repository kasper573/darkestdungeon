import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {commonStyles} from "../config/styles";
import {TooltipArea} from "../lib/TooltipArea";
import {StatsTextList} from "./StatsText";
import {ItemLevel} from "./ItemLevel";
import {Item} from "../state/types/Item";
import {grid} from "../config/Grid";

export class ItemIcon extends React.Component<{
  item?: Item,
  onClick?: () => void,
  style?: any,
  classStyle?: any
}> {
  render () {
    const item = this.props.item;
    const containerStyle = [styles.icon, commonStyles.boxBorder, this.props.classStyle];

    if (!item) {
      return <div className={css(containerStyle)}/>;
    }

    const breakdown = item && (
      <div>
        <ItemLevel key={item.id} type={item.info.type} level={item.level}/>
        <StatsTextList stats={this.props.item.stats.nonNeutral}/>
      </div>
    );

    return (
      <TooltipArea
        tip={breakdown}
        classStyle={containerStyle}
        style={this.props.style}>
        <span style={{flex: 1}} onClick={this.props.onClick}>
          {this.props.item ? this.props.item.info.name : undefined}
        </span>
      </TooltipArea>
    );
  }
}

export const itemSize = {
  width: grid.xSpan(0.5),
  height: grid.ySpan(2)
};

const styles = StyleSheet.create({
  icon: {
    flex: 1,
    ...itemSize,
    backgroundColor: "black",
    fontSize: 10,
    justifyContent: "center",
    alignItems: "center"
  }
});
