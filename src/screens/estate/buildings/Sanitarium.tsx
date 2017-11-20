import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {StaticState} from "../../../state/StaticState";

export class Sanitarium extends React.Component<{
  header?: string
}> {
  static id = "sanitarium";

  render () {
    return (
      <BuildingOverview info={StaticState.instance.buildings.get(Sanitarium.id)}/>
    );
  }
}
