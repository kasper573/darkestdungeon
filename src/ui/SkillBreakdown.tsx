import * as React from "react";
import {SkillInfo, SkillTargetObject} from "../state/types/SkillInfo";
import {commonStyles, Row} from "../config/styles";
import {css, StyleSheet} from "aphrodite";
import {StatsTextList} from "./StatsText";
import {CharacterStatus} from "../state/types/CharacterStatus";
import {PositionDots} from "./PositionDots";

export class SkillBreakdown extends React.Component<{skill: SkillInfo}> {
  render () {
    const displayedStats = this.props.skill.stats.nonNeutral.slice();
    const buffStat = this.props.skill.stats.statusChances.get(CharacterStatus.Buff);

    // Remove buff from displayed stats since we're showing a specific section for skill buffs
    const index = displayedStats.findIndex((stat) => stat.info.id === buffStat.info.id);
    if (index !== -1) {
      displayedStats.splice(index, 1);
    }

    const dotColor = this.props.skill.target.object === SkillTargetObject.Enemy ? "red" : "yellow";
    const dotInnerValues = this.props.skill.target.spots.map((spot) => spot ? 3 : 0);

    return (
      <div>
        <PositionDots
          color={dotColor}
          classStyle={styles.dots}
          innerValues={dotInnerValues}
          size={7}
        />

        <div className={css(commonStyles.positiveText)}>
          {this.props.skill.name}
        </div>

        <StatsTextList stats={displayedStats} long/>

        {this.props.skill.buff && (
          <div>
            <Row>
              {
                this.props.skill.buff.isPositive ?
                  <div className={css(commonStyles.positiveText)}>Buff</div> :
                  <div className={css(commonStyles.negativeText)}>Debuff</div>
              }
              {!buffStat.isNeutral && `(${buffStat.toString()})`}
            </Row>
            <StatsTextList stats={this.props.skill.buff.nonNeutral} long/>
          </div>
        )}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  dots: {
    position: "absolute",
    top: 0, right: 0
  }
});
