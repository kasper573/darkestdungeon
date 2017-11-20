import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {StaticState} from "../../../state/StaticState";

export class Guild extends React.Component<{
  header?: string
}> {
  static id = "guild";

  render () {
    return (
      <BuildingOverview info={StaticState.instance.buildings.get(Guild.id)}/>
    );
  }
}
