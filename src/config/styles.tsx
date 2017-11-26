import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {grid} from "./Grid";

export const commonColors = {
  bloodRed: "rgba(38, 0, 0, 1)",
  gold: "rgb(200, 180, 110)",
  red: "red"
};

export const commonStyleFn = {
  innerShadow (color = "#000000", size: number = grid.gutter) {
    return `inset 0 0 ${size}px ${color}`;
  },

  border (color = "#333", size: number = grid.border) {
    return size + "px solid " + color;
  },

  outline (color?: string) {
    return this.border(color, 1);
  },

  textShadow (color = commonColors.gold, size: number = grid.gutter / 2) {
    return `0px 0px ${size}px ${color}`;
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
