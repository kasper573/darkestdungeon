import * as React from "react";
import {Column, Row} from "../../config/styles";
import {Avatar} from "../../ui/Avatar";
import {HeroEquipment} from "../../ui/HeroEquipment";
import {HeroSkills} from "../../ui/HeroSkills";
import {StatsText} from "../../ui/StatsText";
import {StatsInfo} from "../../state/types/StatsInfo";
import {Hero} from "../../state/types/Hero";
import {StatsModSource} from "../../state/types/StatsInfo";

export class DungeonHeroSummary extends React.Component<{
  hero: Hero
}> {
  render () {
    const hero = this.props.hero;
    return (
      <div>
        <Row>
          <Avatar src={hero.classInfo.avatarUrl}/>
          <Column>
            <span>{hero.name}</span>
            <span>{hero.classInfo.name}</span>
            <span>{hero.affliction.name}</span>
          </Column>
          <HeroSkills />
        </Row>
        <Row>
          <Column>
            <div>HP: 22/22</div>
            <div>Stress: {hero.stress}/{hero.stressMax}</div>

            <StatsText stats={new StatsInfo("ACC", "ACCURACY", 0)}/>
            <StatsText stats={
              new StatsInfo("CRIT", "CRITICAL CHANCE", 0.025, [
                {percentages: -0.1, source: StatsModSource.Affliction},
                {percentages: 0.15, source: StatsModSource.Item},
                {units: 0.05, source: StatsModSource.Quirk}
              ], true)
            }/>
            <StatsText stats={
              new StatsInfo("DMG", "DAMAGE", [3, 7])
            }/>
          </Column>
          <HeroEquipment hero={hero}/>
        </Row>
      </div>
    );
  }
}
