import {Row} from "../config/styles";
import {SkillIcon} from "./SkillIcon";
import {TooltipArea} from "../lib/TooltipArea";
import {todo} from "../config/general";
import * as React from "react";

export class HeroSkills extends React.Component {
  render () {
    return (
      <Row>
        <SkillIcon level={1} unlocked/>
        <SkillIcon />
        <SkillIcon level={1} selected unlocked/>
        <SkillIcon level={1} selected unlocked/>
        <SkillIcon />
        <SkillIcon />
        <SkillIcon level={1} selected unlocked/>
        <TooltipArea tip={todo}>
          [PASS]
        </TooltipArea>
      </Row>
    );
  }
}
