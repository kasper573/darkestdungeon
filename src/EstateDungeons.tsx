import * as React from "react";
import {AppState} from "./AppState";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "./RouterState";

export class EstateDungeons extends React.Component<{state: AppState, path: Path}> {
  render () {
    return (
      <EstateTemplate
        state={this.props.state}
        path={this.props.path}
        continueLabel="Provision"
        continuePath="estateProvision">
        Estate dungeon map
      </EstateTemplate>
    );
  }
}
