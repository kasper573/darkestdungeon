import * as React from "react";
import {Quest, QuestStatus} from "../state/types/Quest";
import {observer} from "mobx-react";
import {css} from "aphrodite";

@observer
export class QuestHeader extends React.Component<{
  quest: Quest,
  onRetreatRequested: () => void
  onLeaveRequested: (status: QuestStatus) => void,
  classStyle?: any
}> {
  renderLeaveButton () {
    if (this.props.quest.inBattle) {
      return (
        <button onClick={this.props.onRetreatRequested}>
          Retreat from combat
        </button>
      );
    }

    if (this.props.quest.isObjectiveMet) {
      return (
        <button onClick={() => this.props.onLeaveRequested(QuestStatus.Victory)}>
          Return to Town
        </button>
      );
    }

    if (this.props.quest.isEscapable) {
      return (
        <button onClick={() => this.props.onLeaveRequested(QuestStatus.Escape)}>
          Escape
        </button>
      );
    }
  }

  render () {
    return (
      <div className={css(this.props.classStyle)}>
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
