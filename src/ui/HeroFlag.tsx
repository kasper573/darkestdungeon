import * as React from "react";
import {observer} from "mobx-react";
import {css, StyleSheet} from "aphrodite";
import {HeroLevel} from "./HeroLevel";
import {StressMeter} from "./StressMeter";
import {Hero} from "../state/types/Hero";
import {QuirkText} from "./QuirkText";

@observer
export class HeroFlag extends React.Component<{
  hero: Hero
}> {
  render () {
    return (
      <div className={css(styles.container)}>
        <HeroLevel hero={this.props.hero}/>
        <StressMeter percentage={this.props.hero.stats.stressPercentage}/>
        {this.props.hero.affliction && (
          <QuirkText quirk={this.props.hero.affliction}/>
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
