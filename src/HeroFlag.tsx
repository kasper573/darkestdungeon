import * as React from "react";
import {Hero} from "./ProfileState";
import {observer} from "mobx-react";
import {css, StyleSheet} from "aphrodite";
import {PopupState} from "./PopupState";
import {HeroLevel} from "./HeroLevel";
import {StressMeter} from "./StressMeter";

@observer
export class HeroFlag extends React.Component<{
  popups: PopupState
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
