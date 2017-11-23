import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {commonStyles} from "../config/styles";
import {TooltipArea} from "../lib/TooltipArea";
import {Item} from "../state/types/Item";
import {grid} from "../config/Grid";
import {ItemBreakdown} from "./ItemBreakdown";

export class ItemIcon extends React.Component<{
  item?: Item,
  style?: any,
  classStyle?: any,
  onClick?: (item: Item) => void,
  onDoubleClick?: (item: Item) => void
}> {
  static defaultProps = {
    onClick: (): null => null,
    onDoubleClick: (): null => null
  };

  render () {
    const item = this.props.item;
    const containerStyle = [styles.icon, commonStyles.boxBorder, this.props.classStyle];

    if (!item) {
      return <div className={css(containerStyle)}/>;
    }

    return (
      <TooltipArea
        tip={<ItemBreakdown item={item}/>}
        onClick={() => this.props.onClick(item)}
        classStyle={containerStyle}
        style={this.props.style}>
        <span style={{flex: 1}} onDoubleClick={() => this.props.onDoubleClick(item)}>
          {this.props.item.info.name}
          {this.props.children}
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    fontSize: 10,
    justifyContent: "center",
    alignItems: "center"
  }
});
