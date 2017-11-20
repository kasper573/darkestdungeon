import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {AppStateComponent} from "../../../AppStateComponent";
import {EstateRosterEntry} from "../EstateRosterEntry";
import {observer} from "mobx-react";
import {StaticState} from "../../../state/StaticState";

@observer
export class StageCoach extends AppStateComponent {
  static id = "coach";

  render () {
    return (
      <BuildingOverview info={StaticState.instance.buildings.get(StageCoach.id)}>
        {this.appState.profiles.activeProfile.coach.map((hero) => (
          <EstateRosterEntry key={hero.id} hero={hero} allowDrop={() => false}/>
        ))}
      </BuildingOverview>
    );
  }
}
