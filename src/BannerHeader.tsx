import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {fonts} from "../assets/fonts";

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
    fontSize: "1.2em",
    fontFamily: fonts.Darkest,
    textShadow: "0px 0px .25em red",
    color: "#aaa"
  }
});
