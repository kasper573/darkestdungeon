import * as React from "react";
import {AppState} from "./AppState";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "./RouterState";
import {Prompt} from "./Popups";

export class EstateDungeons extends React.Component<{state: AppState, path: Path}> {
  checkPartyBeforeContinue () {
    return this.props.state.popups.prompt(
      <Prompt
        query={"Grave danger awaits the underprepared. " +
        "Do you wish to continue without a full contingent?"}
        yesLabel="Still Embark"
        noLabel="Cancel Embark"
      />
    );
  }

  render () {
    return (
      <EstateTemplate
        state={this.props.state}
        path={this.props.path}
        backPath="estateOverview"
        continueCheck={() => this.checkPartyBeforeContinue()}
        continueLabel="Provision"
        continuePath="estateProvision">
        Estate dungeon map
      </EstateTemplate>
    );
  }
}
