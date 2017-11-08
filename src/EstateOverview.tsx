import * as React from "react";
import {AppState} from "./AppState";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "./RouterState";

export class EstateOverview extends React.Component<{state: AppState, path: Path}> {
  render () {
    return (
      <EstateTemplate
        state={this.props.state}
        path={this.props.path}
        continueLabel="Embark"
        continuePath="estateDungeons">
        Estate overview
      </EstateTemplate>
    );
  }
}
