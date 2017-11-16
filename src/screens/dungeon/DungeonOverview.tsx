import * as React from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {css, StyleSheet} from "aphrodite";
import {DungeonControlPanel} from "./DungeonControlPanel";
import {Torch} from "../../ui/Torch";
import {QuestHeader} from "../../ui/QuestHeader";
import {DungeonScene} from "./DungeonScene";
import {AppStateComponent} from "../../AppStateComponent";
import {Hero} from "../../state/profile/Hero";
import {QuestStatus} from "../../state/profile/Quest";

@observer
export class DungeonOverview extends AppStateComponent {
  @observable selectedHero: Hero = Array.from(
    this.appState.profiles.activeProfile.party
  )[0];

  render () {
    const profile = this.appState.profiles.activeProfile;
    const quest = profile.selectedQuest;
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.scene)}>
          <QuestHeader quest={quest} onLeaveRequested={(status) => this.finish(status)}/>
          <Torch quest={quest}/>
          <DungeonScene profile={profile} />
        </div>

        <DungeonControlPanel
          questMap={quest.map}
          selectedHero={this.selectedHero}
        />
      </div>
    );
  }

  finish (status: QuestStatus) {
    this.appState.profiles.activeProfile.selectedQuest.status = status;
    this.appState.router.goto("dungeonResult");
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  scene: {
    flex: 1
  }
});