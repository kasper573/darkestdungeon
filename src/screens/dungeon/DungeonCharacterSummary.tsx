import * as React from "react";
import {Column, Row} from "../../config/styles";
import {Avatar} from "../../ui/Avatar";
import {StatsTextList} from "../../ui/StatsText";
import {QuirkText} from "../../ui/QuirkText";
import {EquipmentDropbox} from "../../ui/EquipmentDropbox";
import {observer} from "mobx-react";
import {TooltipArea} from "../../lib/TooltipArea";
import {SkillIcon} from "../../ui/SkillIcon";
import {Character} from "../../state/types/Character";
import {Skill} from "../../state/types/Skill";

@observer
export class DungeonCharacterSummary extends React.Component<{
  character: Character,
  selectedSkill?: Skill,
  enableSkill?: (skill: Skill) => boolean,
  onSkillClicked?: (skill: Skill) => void
}> {
  static defaultProps = {
    enableSkill: () => false,
    onSkillClicked: (): null => null
  };

  render () {
    const c = this.props.character;
    return (
      <div>
        <Row>
          <Avatar src={c.classInfo.avatarUrl}/>
          <Column>
            <span>{c.name}</span>
            <span>{c.classInfo.name}</span>
            {c.affliction && (
              <QuirkText quirk={c.affliction}/>
            )}
          </Column>
          <Row>
            {c.selectedSkills.map((skill) => (
              <SkillIcon
                key={skill.info.id}
                skill={skill}
                isEnabled={this.props.enableSkill(skill)}
                isSelected={this.props.selectedSkill ? skill.info.id === this.props.selectedSkill.info.id : false}
                onClick={() => this.props.onSkillClicked(skill)}
              />
            ))}
            <TooltipArea onClick={() => this.props.onSkillClicked(null)}>
              [PASS]
            </TooltipArea>
          </Row>
        </Row>
        <Row>
          <Column>
            <div>HP: {c.stats.health.value}/{c.stats.maxHealth.value}</div>
            <div>Stress: {c.stats.stress.value}/{c.stats.maxStress.value}</div>
            <StatsTextList stats={c.stats.base}/>
          </Column>
          <EquipmentDropbox character={c}/>
        </Row>
      </div>
    );
  }
}
