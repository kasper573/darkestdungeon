import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {commonColors, commonStyleFn} from "../config/styles";
import {grid} from "../config/Grid";

export const Tooltip = ({children}: any) => (
  <div className={css(styles.tooltip)}>
    {children}
  </div>
);

const styles = StyleSheet.create({
  tooltip: {
    border: commonStyleFn.border(commonColors.gray),
    boxShadow: commonStyleFn.boxShadow(),
    borderRadius: grid.border,
    fontWeight: "normal",
    padding: grid.gutter,
    backgroundColor: "black",
    color: commonColors.lightGray
  }
});
