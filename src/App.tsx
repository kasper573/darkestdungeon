import * as React from "react";
import {TitleHeader} from "./TitleHeader";
import {css, StyleSheet} from "aphrodite";
import {SoundTester} from "./SoundTester";

export class App extends React.Component {
  render () {
    return (
      <div className={css(styles.base)}>
        <TitleHeader/>
        <div className={css(styles.content)}>
          <SoundTester/>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    fontFamily: "Ubuntu",
    width: "100%",
    height: "100%",
    background: "black",
    color: "white",
    overflow: "hidden",
    padding: "1vw 1vh"
  },

  content: {
    flex: 1
  }
});
