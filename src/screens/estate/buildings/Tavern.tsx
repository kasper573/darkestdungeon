import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {StaticState} from "../../../state/StaticState";
import {AppStateComponent} from "../../../AppStateComponent";

export class Tavern extends AppStateComponent<{
  header?: string
}> {
  static id = "tavern";

  render () {
    return (
      <BuildingOverview info={StaticState.instance.buildings.get(Tavern.id)}/>
    );
  }
}
