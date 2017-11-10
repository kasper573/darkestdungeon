import * as React from "react";
import {AppState} from "./AppState";
import {AdventureStatus} from "./ProfileState";

export class Dungeon extends React.Component<{state: AppState}> {
  render () {
    return (
      <div>
        Dungeon

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
