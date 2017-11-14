import * as React from "react";
import {AppState} from "./AppState";
import {AdventureStatus} from "./ProfileState";
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
          <button onClick={() => this.finish(AdventureStatus.Victory)}>
            Finish Dungeon
          </button>
          <button onClick={() => this.finish(AdventureStatus.Escape)}>
            Escape Dungeon
          </button>
          <button onClick={() => this.finish(AdventureStatus.Defeat)}>
            Dungeon Defeat
          </button>
        </div>
      </div>
    );
  }

  finish (status: AdventureStatus) {
    this.props.state.profiles.activeProfile.adventure.status = status;
    this.props.state.router.goto("dungeonResult");
  }
}
