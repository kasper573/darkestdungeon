import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {StaticState} from "../../../state/StaticState";
import {AppStateComponent} from "../../../AppStateComponent";
import {TreatmentSlots} from "./TreatmentSlots";

export class Tavern extends AppStateComponent {
  static id = "tavern";

  render () {
    const info = StaticState.instance.buildings.get(Tavern.id);
    return (
      <BuildingOverview info={info}>
        <TreatmentSlots info={info} profile={this.activeProfile}/>
      </BuildingOverview>
    );
  }
}
