import * as React from "react";
import {Hero} from "../state/ProfileState";
import {observer} from "mobx-react";
import {css, StyleSheet} from "aphrodite";
import {HeroLevel} from "./HeroLevel";
import {StressMeter} from "./StressMeter";

@observer
export class HeroFlag extends React.Component<{
  hero: Hero
}> {
  render () {
    return (
      <div className={css(styles.container)}>
        <HeroLevel hero={this.props.hero}/>
        <StressMeter percentage={this.props.hero.stressPercentage}/>
        {this.props.hero.affliction && (
          <div>{this.props.hero.affliction.name}</div>
        )}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    background: "black",
    border: "2px solid gray",
    padding: 3
  }
});
