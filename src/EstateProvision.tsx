import * as React from "react";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "./RouterState";
import {Prompt} from "./Popups";
import {BuildingOverview} from "./BuildingOverview";
import {StyleSheet} from "aphrodite";
import {PartyDropbox} from "./PartyDropbox";
import {Item, QuestStatus} from "./ProfileState";
import {observer} from "mobx-react";
import {Store} from "./Store";
import {AppStateComponent} from "./AppStateComponent";

@observer
export class EstateProvision extends AppStateComponent<{path: Path}> {
  private store: Store;
  private initialStoreItems: Item[] =
    this.appState.profiles.activeProfile.generateStoreItems(
      this.appState.itemGenerator
    );

  componentWillMount () {
    this.appState.ambience.activate("estateProvision");
  }

  checkItemsBeforeContinue () {
    return this.appState.popups.prompt(
      <Prompt
        query={"You haven't purchased much food for your expedition. " +
        "It's recommended to take at least 8 food for this quest. Still Embark?"}
      />
    ).then((willEmbark) => {
      if (willEmbark) {
        this.store.checkout();
        this.appState.profiles.activeProfile.selectedQuest.status = QuestStatus.Started;
        return true;
      }
    });
  }

  render () {
    const profile = this.appState.profiles.activeProfile;
    return (
      <EstateTemplate
        path={this.props.path}
        backPath="estateDungeons"
        roster={false}
        continueCheck={() => this.checkItemsBeforeContinue()}
        continueLabel="Embark"
        continuePath={new Path("loading", {target: "dungeonOverview"})}>
        <BuildingOverview
          classStyle={styles.container}
          header="Provision"
          backgroundUrl={require("../assets/images/provision-bg.jpg")}>
          <Store
            ref={(store) => this.store = store}
            initialStoreItems={this.initialStoreItems}
            profile={profile}
          />
        </BuildingOverview>
        <PartyDropbox members={profile.party} lock/>
      </EstateTemplate>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0, left: 0, right: "70%", bottom: 0
  }
});
