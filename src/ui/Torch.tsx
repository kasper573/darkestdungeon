import * as React from "react";
import {Row} from "../config/styles";
import {TooltipArea} from "../lib/TooltipArea";
import {todo} from "../config/general";
import {Quest} from "../state/types/Quest";
import {observer} from "mobx-react";

@observer
export class Torch extends React.Component<{
  quest: Quest
}> {
  render () {
    const quest = this.props.quest;
    return (
      <Row>
        <TooltipArea
          tip={todo} >
          Light: {quest.light}
        </TooltipArea>
        <span>Battle: {quest.inBattle ? `Round ${quest.turn}` : "No battle"}</span>
      </Row>
    );
  }
}
