import * as React from "react";
import {Quest, QuestStatus} from "./ProfileState";

export class QuestHeader extends React.Component<{
  quest: Quest,
  onLeaveRequested: (status: QuestStatus) => void
}> {
  render () {
    return (
      <div>
        <p>
          {this.props.quest.info.type} : {this.props.quest.objective.description}
        </p>
        <div style={{flexDirection: "row"}}>
          <button onClick={() => this.props.onLeaveRequested(QuestStatus.Victory)}>
            Finish Dungeon
          </button>
          <button onClick={() => this.props.onLeaveRequested(QuestStatus.Escape)}>
            Escape Dungeon
          </button>
          <button onClick={() => this.props.onLeaveRequested(QuestStatus.Defeat)}>
            Dungeon Defeat
          </button>
        </div>
      </div>
    );
  }
}
