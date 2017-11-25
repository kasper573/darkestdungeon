import * as React from "react";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "../../state/types/Path";
import {Alert, Prompt} from "../../ui/Popups";
import {observer} from "mobx-react";
import {DungeonBreakdown} from "../../ui/DungeonBreakdown";
import {QuestBreakdown} from "../../ui/QuestBreakdown";
import {LineupDropbox} from "../../ui/LineupDropbox";
import {AppStateComponent} from "../../AppStateComponent";
import {Quest} from "../../state/types/Quest";

@observer
export class EstateDungeons extends AppStateComponent<{path: Path}> {
  groupQuestsByDungeon (quests: Quest[]) {
    return quests.reduce(
      (groups: any, quest) => {
        const list = groups[quest.dungeonId] || (groups[quest.dungeonId] = []);
        list.push(quest);
        return groups;
      },
      {} as {[key: string]: Quest[]}
    );
  }

  checkLineupBeforeContinue () {
    if (this.activeProfile.isLineupFull) {
      return Promise.resolve(true);
    }

    if (this.activeProfile.lineup.length === 0) {
      return this.appState.popups.prompt(
        <Alert message="Please form a party before embarking"/>
      );
    }

    if (!this.selectedQuest) {
      return this.appState.popups.prompt(
        <Alert message="Please select a quest before embarking"/>
      );
    }

    return this.appState.popups.prompt(
      <Prompt
        query={"Grave danger awaits the underprepared. " +
        "Do you wish to continue without a full contingent?"}
        yesLabel="Still Embark"
        noLabel="Cancel Embark"
      />
    );
  }

  render () {
    const questLookup = this.groupQuestsByDungeon(this.activeProfile.quests);
    return (
      <EstateTemplate
        lineupFeaturesInRoster={true}
        path={this.props.path}
        backPath="estateOverview"
        continueCheck={() => this.checkLineupBeforeContinue()}
        continueLabel="Provision"
        continuePath="estateProvision">
        {this.activeProfile.dungeons.map((d) =>
          <DungeonBreakdown
            key={d.id}
            name={d.info.name}
            level={d.level.number}
            progress={d.levelProgress}
            quests={questLookup[d.id]}
            selectedQuestId={this.activeProfile.selectedQuestId}
            onQuestSelected={(quest) => this.activeProfile.selectedQuestId = quest.id}
          />
        )}
        {this.selectedQuest && (
          <QuestBreakdown
            quest={this.selectedQuest}
            dungeon={this.selectedDungeon}
          />
        )}
        <LineupDropbox profile={this.activeProfile}/>
      </EstateTemplate>
    );
  }
}
