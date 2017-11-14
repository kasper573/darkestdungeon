import {PopupState} from "./PopupState";
import {Row} from "./config/styles";
import {SkillIcon} from "./SkillIcon";
import {TooltipArea} from "./TooltipArea";
import {todo} from "./config/general";
import * as React from "react";

export class HeroSkills extends React.Component<{
  popups: PopupState
}> {
  render () {
    const popups = this.props.popups;
    return (
      <Row>
        <SkillIcon popups={popups} level={1} unlocked/>
        <SkillIcon popups={popups}/>
        <SkillIcon popups={popups} level={1} selected unlocked/>
        <SkillIcon popups={popups} level={1} selected unlocked/>
        <SkillIcon popups={popups}/>
        <SkillIcon popups={popups}/>
        <SkillIcon popups={popups} level={1} selected unlocked/>
        <TooltipArea popups={this.props.popups} tip={todo}>
          [PASS]
        </TooltipArea>
      </Row>
    );
  }
}
