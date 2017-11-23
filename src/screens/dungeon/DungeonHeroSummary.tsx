import * as React from "react";
import {Column, Row} from "../../config/styles";
import {Avatar} from "../../ui/Avatar";
import {HeroSkills} from "../../ui/HeroSkills";
import {Hero} from "../../state/types/Hero";
import {StatsTextList} from "../../ui/StatsText";
import {QuirkText} from "../../ui/QuirkText";
import {HeroEquipment} from "../../ui/HeroEquipment";
import {observer} from "mobx-react";

@observer
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
            <QuirkText quirk={hero.affliction}/>
          </Column>
          <HeroSkills skills={hero.skills}/>
        </Row>
        <Row>
          <Column>
            <div>HP: {hero.stats.health.value}/{hero.stats.maxHealth.value}</div>
            <div>Stress: {hero.stats.stress.value}/{hero.stats.maxStress.value}</div>
            <StatsTextList stats={hero.stats.base}/>
          </Column>
          <HeroEquipment hero={hero}/>
        </Row>
      </div>
    );
  }
}
