import * as React from "react";
import {SkillTargetObject} from "../state/types/SkillInfo";
import {commonStyles, Row} from "../config/styles";
import {css, StyleSheet} from "aphrodite";
import {StatsTextList} from "./StatsText";
import {CharacterStatus} from "../state/types/CharacterStatus";
import {PositionDots} from "./PositionDots";
import {Skill} from "../state/types/Skill";
import {removeItem} from "../lib/Helpers";

export class SkillBreakdown extends React.Component<{skill: Skill}> {
  render () {
    const skill = this.props.skill;
    const displayedStats = skill.stats.nonNeutral.slice();
    const buffStat = skill.stats.statusChances.get(CharacterStatus.Buff);

    // Remove buff from displayed stats since we're showing a specific section for skill buffs
    removeItem(displayedStats,
      displayedStats.find((stat) => stat.info.id === buffStat.info.id)
    );

    const dotColor = skill.info.target.object === SkillTargetObject.Enemy ? "red" : "yellow";
    const dotInnerValues = skill.info.target.spots.map((spot) => spot ? 3 : 0);

    return (
      <div>
        <PositionDots
          color={dotColor}
          classStyle={styles.dots}
          innerValues={dotInnerValues}
          size={7}
        />

        <div className={css(commonStyles.positiveText)}>
          {skill.info.name}
        </div>

        <StatsTextList stats={displayedStats} long/>

        {skill.buff && (
          <div>
            <Row>
              {
                skill.buff.isPositive ?
                  <div className={css(commonStyles.positiveText)}>Buff</div> :
                  <div className={css(commonStyles.negativeText)}>Debuff</div>
              }
              {!buffStat.isNeutral && `(${buffStat.toString()})`}
            </Row>
            <StatsTextList stats={skill.buff.nonNeutral} long/>
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
