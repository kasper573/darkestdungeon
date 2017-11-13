import * as React from "react";
import {AppState} from "./AppState";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "./RouterState";
import {Prompt} from "./Popups";

export class EstateProvision extends React.Component<{state: AppState, path: Path}> {
  componentWillMount () {
    this.props.state.ambience.activate("estateProvision");
  }

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
        backPath="estateDungeons"
        continueCheck={() => this.checkItemsBeforeContinue()}
        continueLabel="Embark"
        continuePath={new Path("loading", {target: "dungeon"})}>
        Estate provision
      </EstateTemplate>
    );
  }
}
