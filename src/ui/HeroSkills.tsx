import {Row} from "../config/styles";
import {SkillIcon} from "./SkillIcon";
import {TooltipArea} from "../lib/TooltipArea";
import {todo} from "../config/general";
import * as React from "react";
import {Skill} from "../state/types/Skill";

export class HeroSkills extends React.Component<{
  skills: Skill[],
  onSkillSelected?: (skill: Skill) => void
}> {
  render () {
    return (
      <Row>
        {this.props.skills.map((skill) => (
          <SkillIcon
            key={skill.info.id} skill={skill}
            onClick={() => this.props.onSkillSelected && this.props.onSkillSelected(skill)}
          />
        ))}
        <TooltipArea tip={todo}>
          [PASS]
        </TooltipArea>
      </Row>
    );
  }
}
