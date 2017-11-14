import * as React from "react";
import {Row} from "./config/styles";
import {TooltipArea} from "./TooltipArea";
import {todo} from "./config/general";
import {PopupState} from "./PopupState";
import {Quest} from "./ProfileState";

export class Torch extends React.Component<{
  popups: PopupState,
  quest: Quest
}> {
  render () {
    const quest = this.props.quest;
    return (
      <Row>
        <TooltipArea
          tip={todo}
          popups={this.props.popups}>
          Light: {quest.light}
        </TooltipArea>
        <span>Battle: {quest.battle ? `Round ${quest.battle.round}` : "No battle"}</span>
      </Row>
    );
  }
}
