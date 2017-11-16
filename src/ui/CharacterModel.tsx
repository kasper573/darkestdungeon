import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {Character, Hero} from "../state/ProfileState";
import {StressMeter} from "./StressMeter";
import {HealthMeter} from "./HealthMeter";
import {TooltipArea, TooltipSide} from "../lib/TooltipArea";
import {todo} from "../config/general";

export class CharacterModel extends React.Component<{
  character: Character,
  classStyle?: any
}> {
  get isHero () {
    return this.props.character instanceof Hero;
  }

  render () {
    return (
      <div className={css(styles.model, this.props.classStyle)}>
        <div>{this.props.character.name}</div>
        {this.props.character.affliction && (
          <div>{this.props.character.affliction.name}</div>
        )}
        <TooltipArea
          tip={this.isHero && <HPAndStress character={this.props.character}/>}
          side={TooltipSide.Above}>
          <HealthMeter percentage={0.5}/>
          {this.isHero && (
            <StressMeter percentage={this.props.character.stressPercentage}/>
          )}
        </TooltipArea>
      </div>
    );
  }
}

class HPAndStress extends React.Component<{character: Character}> {
  render () {
    return (
      <div>
        <span>HP: {todo}</span>
        <span>
          Stress: {this.props.character.stress} / {this.props.character.stressMax}
        </span>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  model: {
    background: "green",
    padding: 3,
    margin: 3,
    border: "2px solid gray"
  }
});
