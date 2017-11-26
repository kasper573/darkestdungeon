import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {commonColors, commonStyleFn} from "../config/styles";

export const Tooltip = ({children}: any) => (
  <div className={css(styles.tooltip)}>
    {children}
  </div>
);

const styles = StyleSheet.create({
  tooltip: {
    border: commonStyleFn.border(commonColors.red),
    margin: 2,
    padding: 10,
    backgroundColor: "black",
    color: "white"
  }
});
