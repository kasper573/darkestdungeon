import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {StressMeter} from "./StressMeter";
import {HealthMeter} from "./HealthMeter";
import {TooltipArea} from "../lib/TooltipArea";
import {Character} from "../state/types/Character";
import {Hero} from "../state/types/Hero";
import {QuirkText} from "./QuirkText";
import {StatsTextList} from "./StatsText";
import {commonStyles} from "../config/styles";
import {observer} from "mobx-react";
import {TurnStats} from "../state/types/Stats";

@observer
export class CharacterModel extends React.Component<{
  character: Character,
  highlight?: boolean,
  classStyle?: any,
  onClick?: () => void
}> {
  get isHero () {
    return this.props.character instanceof Hero;
  }

  render () {
    const c = this.props.character;
    const dotBreakdowns: any[] = [];
    c.dots.forEach((stats, status) => {
      const name = stats.statuses.get(status).info.shortName;
      dotBreakdowns.push(
        <TurnBreakdown key={status} turnStats={stats} name={name} invert/>
      );
    });

    return (
      <div
        className={css(styles.model, this.props.highlight && styles.highlight, this.props.classStyle)}
        onClick={this.props.onClick}>
        <div>{c.name}</div>

        {c.affliction && (
          <QuirkText quirk={c.affliction}/>
        )}

        <TooltipArea
          tip={this.isHero && <HPAndStress character={c}/>}>
          <HealthMeter percentage={c.stats.healthPercentage}/>
          {this.isHero && (
            <StressMeter percentage={c.stats.stressPercentage}/>
          )}
        </TooltipArea>
        
        {c.buff && <TurnBreakdown turnStats={c.buff} name={c.buff.isPositive ? "Buff" : "Debuff"}/>}

        {dotBreakdowns}
      </div>
    );
  }
}

class TurnBreakdown extends React.Component<{
  turnStats: TurnStats,
  name: string,
  invert?: boolean
}> {
  render () {
    const stats = this.props.turnStats;
    let isPositive = stats.isPositive;
    if (this.props.invert) {
      isPositive = !isPositive;
    }

    return (
      <TooltipArea
        tip={(
          <div>
            {
              <div className={css(isPositive ?
                commonStyles.positiveText :
                commonStyles.negativeText
              )}>
                {stats.turns} turns
              </div>
            }
            <StatsTextList stats={stats.nonNeutral}/>
          </div>
        )}>
        <div className={css(isPositive ?
          commonStyles.positiveText :
          commonStyles.negativeText
        )}>
          {this.props.name}
        </div>
      </TooltipArea>
    );
  }
}

class HPAndStress extends React.Component<{character: Character}> {
  render () {
    return (
      <div>
        <span style={{whiteSpace: "nowrap"}}>
          HP: {this.props.character.stats.health.value} / {this.props.character.stats.maxHealth.value}
        </span>
        <span style={{whiteSpace: "nowrap"}}>
          Stress: {this.props.character.stats.stress.value} / {this.props.character.stats.maxStress.value}
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
  },

  highlight: {
    borderColor: "gold"
  }
});
