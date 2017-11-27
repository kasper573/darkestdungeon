import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {fonts} from "../../assets/fonts";
import {grid} from "../config/Grid";
import {commonColors, commonStyleFn} from "../config/styles";

export enum CommonButtonSize {
  Medium
}

export class CommonButton extends React.Component<{
  label?: string,
  size?: CommonButtonSize,
  style?: any,
  classStyle?: any,
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}> {
  static defaultProps = {
    size: CommonButtonSize.Medium
  };

  render () {
    const gridRows = sizeToGridRows[this.props.size];
    const gridColumns = sizeToGridColumns[this.props.size];
    const dynamicStyle = {
      fontSize: grid.fontSize(gridRows),
      height: grid.ySpan(gridRows),
      minWidth: grid.xSpan(gridColumns),
      ...this.props.style
    };

    return (
      <div
        className={css(styles.commonButton, this.props.classStyle)}
        style={dynamicStyle}
        onClick={this.props.onClick}>
        <div className={css(styles.bar, styles.above)}/>
        {this.props.label}
        {this.props.children}
        <div className={css(styles.bar, styles.below)}/>
      </div>
    );
  }
}

const sizeToGridRows: {[key: string]: number} = {
  [CommonButtonSize.Medium]: 1
};

const sizeToGridColumns: {[key: string]: number} = {
  [CommonButtonSize.Medium]: 3
};

const styles = StyleSheet.create({
  commonButton: {
    fontFamily: fonts.Darkest,
    color: commonColors.red,
    paddingLeft: grid.gutter,
    paddingRight: grid.gutter,
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, rgba(0,0,0,0) 0%,rgba(0,0,0,1) 20%,rgba(0,0,0,1) 80%,rgba(0,0,0,0) 100%)",

    ":not(:hover)": {
      opacity: 0.8
    }
  },

  bar: {
    background: "linear-gradient(to right, rgba(85,3,1,1) 0%,rgba(246,46,17,1) 50%,rgba(85,3,1,1) 100%)",
    height: grid.border,
    borderRadius: grid.border
  },

  above: commonStyleFn.dock("top"),
  below: commonStyleFn.dock("bottom")
});