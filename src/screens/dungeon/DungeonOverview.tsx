import * as React from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {css, StyleSheet} from "aphrodite";
import {DungeonControlPanel} from "./DungeonControlPanel";
import {Torch} from "../../ui/Torch";
import {QuestHeader} from "../../ui/QuestHeader";
import {DungeonScene} from "./DungeonScene";
import {AppStateComponent} from "../../AppStateComponent";
import {Hero} from "../../state/types/Hero";
import {QuestStatus} from "../../state/types/Quest";

@observer
export class DungeonOverview extends AppStateComponent {
  @observable selectedHero: Hero = Array.from(
    this.activeProfile.party
  )[0];

  render () {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.scene)}>
          <QuestHeader quest={this.selectedQuest} onLeaveRequested={(status) => this.finish(status)}/>
          <Torch quest={this.selectedQuest}/>
          <DungeonScene
            profile={this.activeProfile}
            room={this.selectedQuest.currentRoom}
            onHeroSelected={(hero) => this.selectedHero = hero}
          />
        </div>

        <DungeonControlPanel
          quest={this.selectedQuest}
          profile={this.activeProfile}
          selectedHero={this.selectedHero}
        />
      </div>
    );
  }

  finish (status: QuestStatus) {
    this.selectedQuest.status = status;
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
