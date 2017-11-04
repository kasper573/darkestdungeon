import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {fonts} from "../assets/fonts";

export class TitleHeader extends React.Component {
  render () {
    return (
      <div className={css(styles.container)}>
        <span className={css(styles.text, styles.leftText)}>Darkest</span>
        <span className={css(styles.torch)}/>
        <span className={css(styles.text, styles.rightText)}>Dungeon</span>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    color: "red",
    flexDirection: "row",
    fontFamily: fonts.Darkest,
    fontSize: 48
  },
  leftText: {
  },
  torch: {
    backgroundImage: "url(http://www.freeiconspng.com/uploads/olympic-torch-png-7.png)",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50% 50%",
    width: 100
  },
  rightText: {
  },
  text: {

  }
});
