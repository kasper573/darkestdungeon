import * as React from "react";
import {AppState} from "./AppState";
import {Path} from "./RouterState";

export class DungeonResult extends React.Component<{state: AppState}> {
  componentWillMount () {
    this.props.state.ambience.activate("dungeonResult");
  }

  render () {
    return (
      <div>
        Dungeon Result: {this.props.state.profiles.activeProfile.selectedQuest.status}

        <button onClick={() => this.returnToEstate()}>
          Return to Town
        </button>
      </div>
    );
  }

  returnToEstate () {
    this.props.state.router.goto(
      new Path("loading", {target: "estateOverview"})
    );
  }
}
