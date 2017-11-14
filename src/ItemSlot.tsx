import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {ItemInfo} from "./StaticState";
import {commonStyles} from "./config/styles";
import {TooltipArea, TooltipSide} from "./TooltipArea";
import {PopupState} from "./PopupState";
import {ItemBreakdown} from "./ItemBreakdown";

export class ItemSlot extends React.Component<{
  popups: PopupState,
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
        popups={this.props.popups}
        side={TooltipSide.Above}
        tip={breakdown}
        className={css(styles.itemSlot, commonStyles.boxBorder)}
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
