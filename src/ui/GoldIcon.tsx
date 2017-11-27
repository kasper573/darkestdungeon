import * as React from "react";
import {Icon} from "./Icon";
import {StyleSheet} from "aphrodite";
import {grid} from "../config/Grid";
import {fonts} from "../../assets/fonts";
import {thousands} from "../lib/Helpers";
import {commonStyles} from "../config/styles";

export enum GoldIconSize {
  Small,
  Large
}

export class GoldIcon extends React.Component<{
  size?: GoldIconSize,
  amount?: number,
  compareWith?: number,
  classStyle?: any
}> {
  static defaultProps = {
    size: GoldIconSize.Small
  };

  render () {
    const isLarge = this.props.size === GoldIconSize.Large;
    const amountString = this.props.amount !== undefined ? thousands(this.props.amount) : undefined;
    const src = isLarge ?
      require("../../assets/dd/images/shared/estate/currency.gold.large_icon.png") :
      require("../../assets/dd/images/shared/estate/currency.gold.icon.png");

    const notEnough = this.props.compareWith !== undefined && (this.props.amount > this.props.compareWith);

    return (
      <Icon
        src={src}
        iconStyle={isLarge ? styles.largeIcon : styles.smallIcon}
        scale={isLarge ? 2 : 1}
        side={amountString}
        classStyle={[
          isLarge ? styles.largeText : styles.smallText,
          notEnough && commonStyles.negativeText,
          this.props.classStyle
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  largeText: {
    fontSize: grid.fontSize(1),
    fontFamily: fonts.Darkest,
    fontWeight: "normal"
  },

  largeIcon: {
    height: grid.ySpan(1),
    width: grid.ySpan(1)
  },

  smallText: {
    fontSize: grid.fontSize(0.5),
    fontFamily: fonts.Darkest,
    fontWeight: "normal"
  },

  smallIcon: {
    height: grid.gutter * 2.5,
    width: grid.gutter * 2.5
  }
});
