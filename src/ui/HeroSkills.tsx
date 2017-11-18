import {Row} from "../config/styles";
import {SkillIcon} from "./SkillIcon";
import {TooltipArea} from "../lib/TooltipArea";
import {todo} from "../config/general";
import * as React from "react";
import {SkillInfo} from "../state/types/SkillInfo";

export class HeroSkills extends React.Component<{
  skills: SkillInfo [],
  onSkillSelected?: (skill: SkillInfo) => void
}> {
  render () {
    return (
      <Row>
        {this.props.skills.map((skill) => (
          <SkillIcon
            key={skill.id} level={1} selected unlocked skill={skill}
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
