import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {fonts} from "../assets/fonts";
import {Sprite} from "./Sprite";
import {smoke} from "../assets/sprites";

export class TitleHeader extends React.Component {
  render () {
    return (
      <div className={css(styles.container)}>
        <span className={css(styles.textLeft)}>Dankest</span>
        <Sprite {...smoke} className={css(styles.torch)}/>
        <span className={css(styles.textRight)}>Dungeon</span>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    color: "red",
    flexDirection: "row",
    fontFamily: fonts.Darkest,
    fontSize: "10vw"
  },

  textLeft: {
    flex: 1,
    alignItems: "flex-end"
  },

  textRight: {
    flex: 1
  },

  torch: {
    width: "10vw",
    height: "10vw"
  }
});
