import * as React from "react";
import {css, StyleSheet} from "aphrodite";

export const commonStyles = StyleSheet.create({
  characterName: {
    fontWeight: "bold",
    color: "rgb(200, 180, 110)"
  },

  upgradeName: {
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
    color: "rgb(200, 180, 110)"
  },

  negativeText: {
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

export const Cell = ({baseClassStyle, children, classStyle, className, style}: any) => {
  const fullClassName = className ?
    css(baseClassStyle, classStyle) + " " + className :
    css(baseClassStyle, classStyle);

  return (
    <div className={fullClassName} style={style}>
      {children}
    </div>
  );
};

export const Row = (props: any) => {
  return <Cell {...props} baseClassStyle={commonStyles.row}/>;
};

export const Column = (props: any) => {
  return <Cell {...props} baseClassStyle={commonStyles.column}/>;
};
