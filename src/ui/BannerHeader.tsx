import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {fonts} from "../../assets/fonts";
import {grid} from "../config/Grid";
import {commonColors, commonStyleFn} from "../config/styles";

export class BannerHeader extends React.Component {
  render () {
    return (
      <div className={css(styles.bannerHeader)}>
        {this.props.children}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  bannerHeader: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: grid.fontSize(1),
    fontFamily: fonts.Darkest,
    padding: grid.gutter,
    color: commonColors.gold,
    border: commonStyleFn.border(undefined, grid.border * 2),
    backgroundColor: "black",
    boxShadow: commonStyleFn.boxShadow()
  }
});
