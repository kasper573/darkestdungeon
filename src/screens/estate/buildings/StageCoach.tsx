import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {AppStateComponent} from "../../../AppStateComponent";
import {EstateRosterEntry} from "../EstateRosterEntry";
import {observer} from "mobx-react";

@observer
export class StageCoach extends AppStateComponent {
  static id = "coach";

  render () {
    return (
      <BuildingOverview
        header="Stage Coach"
        backgroundUrl={require("../../../../assets/images/coach-bg.jpg")}
      >
        {this.appState.profiles.activeProfile.coach.map((hero) => (
          <EstateRosterEntry key={hero.id} hero={hero} allowDrop={() => false}/>
        ))}
      </BuildingOverview>
    );
  }
}
