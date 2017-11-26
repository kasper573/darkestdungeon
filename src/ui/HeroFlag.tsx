import * as React from "react";
import {observer} from "mobx-react";
import {css, StyleSheet} from "aphrodite";
import {LevelIcon} from "./LevelIcon";
import {StressMeter} from "./StressMeter";
import {Hero} from "../state/types/Hero";
import {QuirkText} from "./QuirkText";
import {Experienced} from "../state/types/Experienced";
import {commonStyleFn} from "../config/styles";

@observer
export class HeroFlag extends React.Component<{
  hero: Hero,
  exp?: Experienced
}> {
  render () {
    const hero = this.props.hero;
    const exp = this.props.exp !== undefined ? this.props.exp : hero;
    return (
      <div className={css(styles.container)}>
        <LevelIcon exp={exp}/>
        <StressMeter percentage={hero.stats.stressPercentage}/>
        {hero.affliction && (
          <QuirkText quirk={hero.affliction}/>
        )}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    background: "black",
    border: commonStyleFn.border(),
    padding: 3
  }
});
