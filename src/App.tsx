import * as React from "react";
import {TitleHeader} from "./TitleHeader";
import {css, StyleSheet} from "aphrodite";

export class App extends React.Component {
  render () {
    return (
      <div className={css(styles.base)}>
        <TitleHeader/>
        <div>
          Hello World
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    fontFamily: "Ubuntu"
  }
});
