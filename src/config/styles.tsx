import * as React from "react";
import {css, StyleSheet} from "aphrodite";

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

  heroName: {
    fontWeight: "bold",
    color: "rgb(200, 180, 110)"
  },

  upgradeName: {
    fontWeight: "bold",
    color: "rgb(200, 180, 110)"
  },

  dungeonName: {
    fontWeight: "bold",
    color: "rgb(200, 180, 110)"
  },

  commonName: {
    fontWeight: "bold",
    color: "rgb(200, 180, 110)"
  },

  boxBorder: {
    border: "2px solid gray"
  },

  afflictionText: {
    color: "red"
  },

  positiveText: {
    whiteSpace: "nowrap",
    color: "rgb(200, 180, 110)"
  },

  negativeText: {
    whiteSpace: "nowrap",
    color: "red"
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
