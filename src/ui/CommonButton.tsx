import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {fonts} from "../../assets/fonts";
import {grid} from "../config/Grid";
import {commonColors} from "../config/styles";
import {VerticalOutlineBox} from "./VerticalOutlineBox";

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

        {this.props.label}
        {this.props.children}

        <VerticalOutlineBox color={commonColors.brightRed}/>
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
  }
});
