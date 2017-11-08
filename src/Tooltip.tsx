import * as React from "react";
import {css, StyleSheet} from "aphrodite";

export const Tooltip = ({children}: any) => (
  <div className={css(styles.tooltip)}>
    {children}
  </div>
);

const styles = StyleSheet.create({
  tooltip: {
    border: "2px solid red",
    margin: 2,
    padding: 10,
    backgroundColor: "black",
    color: "white"
  }
});
