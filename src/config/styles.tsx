import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {grid} from "./Grid";

export const commonColors = {
  bloodRed: "rgba(38, 0, 0, 1)",
  gold: "rgb(200, 180, 110)",
  red: "rgb(177, 25, 0)",
  gray: "#333",
  darkGray: "#111"
};

export const commonStyleFn = {
  boxShadow (inset: boolean = false, color = "#000000", size: number = grid.gutter) {
    const prefix = inset ? "inset " : "";
    return prefix + `0 0 ${size}px ${color}`;
  },

  innerShadow (color = "#000000", size: number = grid.gutter) {
    return this.boxShadow(true, color, size);
  },

  outerShadow (color = "#000000", size: number = grid.gutter) {
    return this.boxShadow(false, color, size);
  },

  border (color = "#333", size: number = grid.border) {
    return size + "px solid " + color;
  },

  outline (color?: string) {
    return this.border(color, 1);
  },

  textShadow (color = commonColors.gold, size: number = grid.gutter / 2) {
    return `0px 0px ${size}px ${color}`;
  },

  dockWithPadding (xPadding: number, yPadding: number): any {
    return {
      position: "absolute",
      top: yPadding, right: xPadding, bottom: yPadding, left: xPadding
    };
  },

  dock (side?: string) {
    const style: any = {position: "absolute", top: 0, right: 0, bottom: 0, left: 0};
    switch (side) {
      case "top": delete style.bottom; break;
      case "right": delete style.left; break;
      case "bottom": delete style.top; break;
      case "left": delete style.right; break;
    }
    return style;
  }
};

export const commonStyles = StyleSheet.create({
  fill: {
    flex: 1
  },

  nowrap: {
    whiteSpace: "nowrap"
  },

  resetFlex: {
    flex: "inherit"
  },

  commonName: {
    fontWeight: "bold",
    color: commonColors.gold
  },

  boxBorder: {
    border: commonStyleFn.border()
  },

  positiveText: {
    whiteSpace: "nowrap",
    color: commonColors.gold
  },

  negativeText: {
    whiteSpace: "nowrap",
    color: commonColors.red
  },

  row: {
    flexDirection: "row"
  },

  column: {
    flex: 1,
    flexDirection: "column"
  }
});

type CellProps = {
  baseClassStyle?: any,
  classStyle?: any,
  children?: any,
  style?: any,
  onClick?: () => void
};

export const Cell = ({baseClassStyle, children, classStyle, ...rest}: CellProps) => {
  return (
    <div className={css(baseClassStyle, classStyle)} {...rest}>
      {children}
    </div>
  );
};

export const Row = (props: CellProps) => {
  return <Cell {...props} baseClassStyle={commonStyles.row}/>;
};

export const Column = (props: CellProps) => {
  return <Cell {...props} baseClassStyle={commonStyles.column}/>;
};
