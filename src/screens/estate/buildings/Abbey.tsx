import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {StaticState} from "../../../state/StaticState";

export class Abbey extends React.Component<{
  header?: string
}> {
  static id = "abbey";

  render () {
    return (
      <BuildingOverview info={StaticState.instance.buildings.get(Abbey.id)}/>
    );
  }
}
