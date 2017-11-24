import * as React from "react";
import {Quest, QuestStatus} from "../state/types/Quest";
import {Row} from "../config/styles";

export class QuestHeader extends React.Component<{
  quest: Quest,
  onLeaveRequested: (status: QuestStatus) => void
}> {
  render () {
    const leaveStatus = this.props.quest.isObjectiveMet ? QuestStatus.Victory : QuestStatus.Escape;
    const leaveLabel = this.props.quest.isObjectiveMet ? "Return to Town" : "Escape";
    return (
      <div>
        <div>
          Quest: {this.props.quest.info.type} : {this.props.quest.objective.description}
        </div>
        <div>
          Progress:
          {Math.round(this.props.quest.monsterPercentage * 100)}% monsters,
          {Math.round(this.props.quest.explorePercentage * 100)}% explored
        </div>

        <button onClick={() => this.props.onLeaveRequested(leaveStatus)}>
          {leaveLabel}
        </button>

        <Row>
          <span>Debug:</span>
          <button onClick={() => this.props.onLeaveRequested(QuestStatus.Victory)}>
            Victory
          </button>
          <button onClick={() => this.props.onLeaveRequested(QuestStatus.Escape)}>
            Escape
          </button>
          <button onClick={() => this.props.onLeaveRequested(QuestStatus.Defeat)}>
            Defeat
          </button>
        </Row>
      </div>
    );
  }
}
