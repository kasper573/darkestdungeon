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
  onClick?: () => void,
  onRightClick?: () => void
}> {
  static defaultProps = {
    onClick: (): null => null,
    onRightClick: (): null => null
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
        classStyle={containerStyle}
        style={this.props.style}>
        <div
          className={css(commonStyles.fill)}
          onClick={this.props.onClick.bind(this)}
          onContextMenu={(e) => {
            e.preventDefault();
            this.props.onRightClick();
            return false;
          }}>
          {this.props.item.info.name.substr(0, 3)}
          {this.props.children}
        </div>
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
    justifyContent: "center",
    alignItems: "center"
  }
});
