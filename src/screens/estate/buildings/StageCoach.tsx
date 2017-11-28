import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {AppStateComponent} from "../../../AppStateComponent";
import {EstateRosterEntry} from "../EstateRosterEntry";
import {observer} from "mobx-react";
import {StaticState} from "../../../state/StaticState";
import {Hero} from "../../../state/types/Hero";
import {Alert} from "../../../ui/Popups";

@observer
export class StageCoach extends AppStateComponent {
  static id = "coach";

  tryRecruitHero (draggedHero: Hero, monitor: any) {
    if (!monitor.didDrop()) {
      return;
    }
    if (this.activeProfile.isRosterFull) {
      this.appState.popups.show(
        <Alert message="The Hero Barracks is full. You can upgrade the barracks at the Stage Coach."/>
      );
      return;
    }
    this.activeProfile.recruitHero(draggedHero);
  }

  render () {
    return (
      <BuildingOverview info={StaticState.instance.buildings.get(StageCoach.id)}>
        {this.activeProfile.coach.map((hero) => (
          <EstateRosterEntry
            key={hero.id}
            hero={hero}
            onDragEnd={this.tryRecruitHero.bind(this)}
            allowDrop={() => false}
          />
        ))}
      </BuildingOverview>
    );
  }
}
