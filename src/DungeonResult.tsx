import * as React from "react";
import {AppState} from "./AppState";
import {Path} from "./RouterState";

export class DungeonResult extends React.Component<{state: AppState, status: string}> {
  render () {
    return (
      <div>
        Dungeon Result: {this.props.status}

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
