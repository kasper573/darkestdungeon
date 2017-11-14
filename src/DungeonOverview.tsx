import * as React from "react";
import {AppState} from "./AppState";
import {QuestStatus} from "./ProfileState";
import {observer} from "mobx-react";

@observer
export class DungeonOverview extends React.Component<{state: AppState}> {
  componentWillMount () {
    this.props.state.ambience.activate("dungeonOverview");
  }

  render () {
    const profile = this.props.state.profiles.activeProfile;
    const quest = profile.selectedQuest;
    return (
      <div>
        Dungeon

        <p>
          {quest.objective.description}
        </p>
        <div style={{flexDirection: "row"}}>
          <button onClick={() => this.finish(QuestStatus.Victory)}>
            Finish Dungeon
          </button>
          <button onClick={() => this.finish(QuestStatus.Escape)}>
            Escape Dungeon
          </button>
          <button onClick={() => this.finish(QuestStatus.Defeat)}>
            Dungeon Defeat
          </button>
        </div>
      </div>
    );
  }

  finish (status: QuestStatus) {
    this.props.state.profiles.activeProfile.selectedQuest.status = status;
    this.props.state.router.goto("dungeonResult");
  }
}
