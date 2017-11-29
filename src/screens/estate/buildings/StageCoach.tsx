import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {AppStateComponent} from "../../../AppStateComponent";
import {EstateRosterEntry} from "../EstateRosterEntry";
import {observer} from "mobx-react";
import {StaticState} from "../../../state/StaticState";
import {css, StyleSheet} from "aphrodite";
import {BannerHeader} from "../../../ui/BannerHeader";
import {grid} from "../../../config/Grid";

@observer
export class StageCoach extends AppStateComponent {
  static id = "coach";

  renderMessage () {
    if (this.activeProfile.coach.length === 0) {
      return (
        <BannerHeader classStyle={styles.coachMessage}>
          All heroes have been recruited. <br/>
          New recruits will arrive next week.
        </BannerHeader>
      );
    }

    if (this.activeProfile.isRosterFull) {
      return (
        <BannerHeader classStyle={styles.coachMessage}>
          The Hero Barracks is full. <br/>
          You can upgrade the barracks at the Stage Coach.
        </BannerHeader>
      );
    }
  }

  render () {
    return (
      <BuildingOverview coverupRight={false} info={StaticState.instance.buildings.get(StageCoach.id)}>
        <div className={css(styles.coachList)}>
          {this.renderMessage()}

          {this.activeProfile.coach.map((hero) => (
            <EstateRosterEntry
              key={hero.id}
              hero={hero}
              transparent={true}
              onDragEnd={(draggedHero, monitor) => monitor.didDrop() && this.activeProfile.recruitHero(draggedHero)}
              allowDrag={() => !this.activeProfile.isRosterFull}
              allowDrop={() => false}
              classStyle={styles.coachEntry}
            />
          ))}
        </div>
      </BuildingOverview>
    );
  }
}

const styles = StyleSheet.create({
  coachList: {
    alignItems: "flex-end"
  },

  coachEntry: {
    flex: "none"
  },

  coachMessage: {
    margin: grid.ySpan(1)
  }
});
