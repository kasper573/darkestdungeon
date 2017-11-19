import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {EstateRosterEntry} from "../EstateRosterEntry";
import {AppStateComponent} from "../../../AppStateComponent";
import {observer} from "mobx-react";

@observer
export class Graveyard extends AppStateComponent {
  static id = "graveyard";

  render () {
    return (
      <BuildingOverview
        header="Graveyard"
        backgroundUrl={require("../../../../assets/images/graveyard-bg.jpg")}>
        {this.appState.profiles.activeProfile.graveyard.map((hero) => (
          <EstateRosterEntry
            key={hero.id} hero={hero}
            allowDrop={() => false}
            allowDrag={() => false}
          />
        ))}
      </BuildingOverview>
    );
  }
}
