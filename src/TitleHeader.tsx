import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {fonts} from "../assets/fonts";
import {Sprite} from "./Sprite";
import {smoke} from "../assets/sprites";

export class TitleHeader extends React.Component {
  render () {
    return (
      <div className={css(styles.container)}>
        <span className={css(styles.textLeft, styles.text)}>Dankest</span>
        <Sprite {...smoke} classStyle={styles.torch}/>
        <span className={css(styles.textRight, styles.text)}>Dungeon</span>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    color: "black",
    flexDirection: "row",
    fontFamily: fonts.Darkest,
    fontSize: "10vw"
  },

  text: {
    textShadow: "0px 0px 1vw red",
    transition: "text-shadow 0.5s",
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
