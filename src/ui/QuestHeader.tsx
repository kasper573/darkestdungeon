import * as React from "react";
import {Quest, QuestStatus} from "../state/types/Quest";
import {observer} from "mobx-react";

@observer
export class QuestHeader extends React.Component<{
  quest: Quest,
  onRetreatRequested: () => void
  onLeaveRequested: (status: QuestStatus) => void
}> {
  renderLeaveButton () {
    if (this.props.quest.inBattle) {
      return (
        <button onClick={this.props.onRetreatRequested}>
          Retreat from combat
        </button>
      );
    }

    const leaveStatus = this.props.quest.isObjectiveMet ? QuestStatus.Victory : QuestStatus.Escape;
    const leaveLabel = this.props.quest.isObjectiveMet ? "Return to Town" : "Escape";
    return (
      <button onClick={() => this.props.onLeaveRequested(leaveStatus)}>
        {leaveLabel}
      </button>
    );
  }

  render () {
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

        {this.renderLeaveButton()}
      </div>
    );
  }
}
