import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {StaticState} from "../../../state/StaticState";

export class Memoirs extends React.Component<{
  header?: string
}> {
  static id = "memoirs";

  render () {
    return (
      <BuildingOverview info={StaticState.instance.buildings.get(Memoirs.id)}/>
    );
  }
}
