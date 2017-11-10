import * as React from "react";
import {AppState} from "./AppState";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "./RouterState";
import {Prompt} from "./Popups";

export class EstateProvision extends React.Component<{state: AppState, path: Path}> {
  checkItemsBeforeContinue () {
    return this.props.state.popups.prompt(
      <Prompt
        query={"You haven't purchased much food for your expedition. " +
        "It's recommended to take at least 8 food for this quest. Still Embark?"}
      />
    );
  }

  render () {
    return (
      <EstateTemplate
        state={this.props.state}
        path={this.props.path}
        continueCheck={() => this.checkItemsBeforeContinue()}
        continueLabel="Embark"
        continuePath={new Path("loading", {target: "dungeon"})}>
        Estate provision
      </EstateTemplate>
    );
  }
}
