import * as React from "react";
import {AppState} from "./AppState";
import {Path} from "./RouterState";

export class Dungeon extends React.Component<{state: AppState}> {
  render () {
    const state = this.props.state;
    return (
      <div>
        Dungeon

        <div style={{flexDirection: "row"}}>
          <button onClick={() => state.router.goto(new Path("dungeonResult", {status: "Victory"}))}>
            Finish Dungeon
          </button>
          <button onClick={() => state.router.goto(new Path("dungeonResult", {status: "Escape"}))}>
            Escape Dungeon
          </button>
          <button onClick={() => state.router.goto(new Path("dungeonResult", {status: "Defeat"}))}>
            Dungeon Defeat
          </button>
        </div>
      </div>
    );
  }
}
