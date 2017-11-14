import * as React from "react";
import {AppState} from "./AppState";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "./RouterState";
import {Alert, Prompt} from "./Popups";
import {Quest} from "./ProfileState";
import {observer} from "mobx-react";
import {EstateDungeonBreakdown} from "./EstateDungeonBreakdown";
import {QuestBreakdown} from "./QuestBreakdown";
import {PartyDropbox} from "./PartyDropbox";

@observer
export class EstateDungeons extends React.Component<{state: AppState, path: Path}> {
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
      return Promise.resolve(true);
    }

    if (profile.party.length === 0) {
      return this.props.state.popups.prompt(
        <Alert message="Please form a party before embarking"/>
      );
    }

    if (!profile.selectedQuest) {
      return this.props.state.popups.prompt(
        <Alert message="Please select a quest before embarking"/>
      );
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
            selectedQuestId={profile.selectedQuestId}
            onQuestSelected={(quest) => profile.selectedQuestId = quest.id}
          />
        )}
        {profile.selectedQuest && (
          <QuestBreakdown
            quest={profile.selectedQuest}
            popups={this.props.state.popups}
          />
        )}
        <PartyDropbox members={profile.party}/>
      </EstateTemplate>
    );
  }
}
