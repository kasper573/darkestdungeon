import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {EstateRosterEntry} from "../EstateRosterEntry";
import {AppStateComponent} from "../../../AppStateComponent";
import {observer} from "mobx-react";
import {StaticState} from "../../../state/StaticState";
import {BannerHeader} from "../../../ui/BannerHeader";
import {StyleSheet} from "aphrodite";
import {grid} from "../../../config/Grid";
import {HorizontalDivider} from "../../../ui/HorizontalDivider";

@observer
export class Graveyard extends AppStateComponent {
  static id = "graveyard";

  renderMessage () {
    if (this.activeProfile.graveyard.length === 0) {
      return (
        <BannerHeader classStyle={styles.coachMessage}>
          None of your heroes have died! Yet...
        </BannerHeader>
      );
    }
  }

  render () {
    const lastIndex = this.activeProfile.graveyard.length - 1;
    const elements: React.ReactNode[] = [];

    this.activeProfile.graveyard.forEach((hero, index) => {
      elements.push(
        <EstateRosterEntry
          key={hero.id} hero={hero}
          allowDrop={() => false}
          allowDrag={() => false}
        />
      );

      if (index !== lastIndex) {
        elements.push(
          <HorizontalDivider key={"divider" + index}/>
        );
      }
    });

    return (
      <BuildingOverview coverupRight={false} info={StaticState.instance.buildings.get(Graveyard.id)}>
        {this.renderMessage()}
        {elements}
      </BuildingOverview>
    );
  }
}

const styles = StyleSheet.create({
  coachMessage: {
    margin: grid.ySpan(1)
  }
});
