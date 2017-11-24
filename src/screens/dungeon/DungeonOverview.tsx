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
import {Alert, Prompt} from "../../ui/Popups";

@observer
export class DungeonOverview extends AppStateComponent {
  @observable selectedHero: Hero = Array.from(this.activeProfile.party)[0];
  private reactionDisposers: Array<() => void>;

  componentWillMount () {
    this.reactionDisposers = [
      ...this.selectedQuest.initialize(),
      this.selectedQuest.whenVictorious(
        () => this.endQuestPopup(QuestStatus.Victory)
      ),
      this.activeProfile.whenPartyWipes(
        () => this.endQuest(QuestStatus.Defeat)
      )
    ];
  }

  componentWillUnmount () {
    this.reactionDisposers.forEach((dispose) => dispose());
  }

  async endQuestPopup (status: QuestStatus) {
    let promise;
    switch (status) {
      case QuestStatus.Defeat:
        promise = this.appState.popups.prompt(
          <Alert message="You have been defeated. Returning to town."/>
        ).then(() => true);
        break;
      case QuestStatus.Escape:
        promise = this.appState.popups.prompt(
          <Prompt query={"Escape this dungeon and return to town?"}/>
        );
        break;
      case QuestStatus.Victory:
        promise = this.appState.popups.prompt(
          <Prompt query={"You are victorious! Return to town now?"}/>
        );
        break;
    }

    const proceed = await promise;
    if (proceed) {
      this.endQuest(status);
    }
  }

  async battleRetreatPopup () {
    const proceed = await this.appState.popups.prompt(
      <Prompt query={"Are you sure you want to retreat from this battle?"}/>
    );

    if (proceed) {
      this.selectedQuest.retreatFromBattle();
    }
  }

  render () {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.scene)}>
          <QuestHeader
            quest={this.selectedQuest}
            onRetreatRequested={this.battleRetreatPopup.bind(this)}
            onLeaveRequested={this.endQuestPopup.bind(this)}
          />

          <Torch quest={this.selectedQuest}/>
          <DungeonScene
            selectedHero={this.selectedHero}
            party={this.activeProfile.party}
            battle={this.selectedQuest.battle}
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

  endQuest (status?: QuestStatus) {
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
