import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {grid} from "../config/Grid";
import {commonColors, commonStyleFn} from "../config/styles";

export class BannerHeader extends React.Component<{
  classStyle?: any
}> {
  render () {
    return (
      <div className={css(styles.bannerHeader, this.props.classStyle)}>
        {this.props.children}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  bannerHeader: {
    textAlign: "center",
    fontWeight: "bold",
    padding: grid.gutter / 2,
    color: commonColors.gold,
    border: commonStyleFn.border(undefined, grid.border * 2),
    backgroundColor: "black",
    boxShadow: commonStyleFn.boxShadow()
  }
});
