import * as React from "react";
import {TitleHeader} from "./TitleHeader";
import {AppState} from "./AppState";
import {Path} from "./RouterState";

export class Start extends React.Component<{state: AppState}> {
  selectProfile () {
    this.transitionOut().then(() =>
      this.props.state.router.goto(
        new Path("loading", {target: "estateOverview"})
      )
    );
  }

  transitionOut () {
    console.warn("Not implemented");
    return Promise.resolve();
  }

  render () {
    return (
      <div>
        <TitleHeader/>

        <button onClick={() => this.selectProfile()}>
          Start
        </button>
      </div>
    );
  }
}
