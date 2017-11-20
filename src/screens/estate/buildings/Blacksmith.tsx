import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {StaticState} from "../../../state/StaticState";

export class Blacksmith extends React.Component<{
  header?: string
}> {
  static id = "blacksmith";

  render () {
    return (
      <BuildingOverview info={StaticState.instance.buildings.get(Blacksmith.id)}/>
    );
  }
}
