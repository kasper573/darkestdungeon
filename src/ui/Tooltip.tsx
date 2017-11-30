import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {commonColors, commonStyleFn} from "../config/styles";
import {grid} from "../config/Grid";
import {fonts} from "../../assets/fonts";

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
    fontFamily: fonts.Default,
    fontWeight: "normal",
    padding: grid.gutter,
    backgroundColor: "black",
    color: commonColors.lightGray
  }
});
