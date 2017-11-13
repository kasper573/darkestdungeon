import * as React from "react";
import {AppState} from "./AppState";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "./RouterState";
import {Prompt} from "./Popups";
import {Quest} from "./ProfileState";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {EstateDungeonBreakdown} from "./EstateDungeonBreakdown";
import {QuestBreakdown} from "./QuestBreakdown";
import {PartyDropbox} from "./PartyDropbox";

@observer
export class EstateDungeons extends React.Component<{state: AppState, path: Path}> {
  @observable selectedQuest: Quest = Array.from(
    this.props.state.profiles.activeProfile.quests
  )[0];

  componentWillMount () {
    this.props.state.ambience.activate("estateDungeons");
  }

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

  checkPartyBeforeContinue () {
    const profile = this.props.state.profiles.activeProfile;
    if (profile.party.length === profile.maxPartySize) {
      return Promise.resolve();
    }

    return this.props.state.popups.prompt(
      <Prompt
        query={"Grave danger awaits the underprepared. " +
        "Do you wish to continue without a full contingent?"}
        yesLabel="Still Embark"
        noLabel="Cancel Embark"
      />
    );
  }

  render () {
    const profile = this.props.state.profiles.activeProfile;
    const questLookup = this.groupQuestsByDungeon(profile.quests);
    return (
      <EstateTemplate
        partyFeaturesInRoster={true}
        state={this.props.state}
        path={this.props.path}
        backPath="estateOverview"
        continueCheck={() => this.checkPartyBeforeContinue()}
        continueLabel="Provision"
        continuePath="estateProvision">
        {profile.dungeons.map((d) =>
          <EstateDungeonBreakdown
            key={d.id}
            name={d.dungeonInfo.name}
            level={d.level.number}
            progress={d.levelProgress}
            quests={questLookup[d.id]}
            selectedQuestId={this.selectedQuest && this.selectedQuest.id}
            onQuestSelected={(quest) => this.selectedQuest = quest}
          />
        )}
        {this.selectedQuest && (
          <QuestBreakdown
            quest={this.selectedQuest}
            popups={this.props.state.popups}
          />
        )}
        <PartyDropbox members={profile.party}/>
      </EstateTemplate>
    );
  }
}
