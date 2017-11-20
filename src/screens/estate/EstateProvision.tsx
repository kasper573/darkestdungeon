import * as React from "react";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "../../state/types/Path";
import {Prompt} from "../../ui/Popups";
import {BuildingOverview} from "./buildings/BuildingOverview";
import {StyleSheet} from "aphrodite";
import {PartyDropbox} from "../../ui/PartyDropbox";
import {observer} from "mobx-react";
import {Store} from "./Store";
import {AppStateComponent} from "../../AppStateComponent";
import {Item} from "../../state/types/Item";
import {QuestStatus} from "../../state/types/Quest";
import {StaticState} from "../../state/StaticState";

@observer
export class EstateProvision extends AppStateComponent<{path: Path}> {
  private store: Store;
  private initialStoreItems: Item[] = this.appState.profiles.activeProfile.getStoreItems();

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
        continuePath="dungeonOverview">
        <BuildingOverview
          classStyle={styles.container}
          info={StaticState.instance.buildings.get("provision")}>
          <Store
            ref={(store) => this.store = store}
            initialStoreItems={this.initialStoreItems}
            profile={profile}
          />
        </BuildingOverview>
        <PartyDropbox profile={profile} lock/>
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
