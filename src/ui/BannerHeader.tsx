import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {fonts} from "../../assets/fonts";
import {grid} from "../config/Grid";

export class BannerHeader extends React.Component {
  render () {
    return (
      <span className={css(styles.banner)}>
        {this.props.children}
      </span>
    );
  }
}

const styles = StyleSheet.create({
  banner: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: grid.fontSize(1),
    fontFamily: fonts.Darkest,
    textShadow: "0px 0px .25em red"
  }
});
