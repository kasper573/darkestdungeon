import * as React from "react";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "../../state/types/Path";
import {Popup, popupOffset, Prompt} from "../../ui/Popups";
import {BuildingOverview} from "./buildings/BuildingOverview";
import {StyleSheet} from "aphrodite";
import {LineupDropbox} from "../../ui/LineupDropbox";
import {observer} from "mobx-react";
import {Store} from "./Store";
import {AppStateComponent} from "../../AppStateComponent";
import {Item} from "../../state/types/Item";
import {QuestStatus} from "../../state/types/Quest";
import {StaticState} from "../../state/StaticState";

@observer
export class EstateProvision extends AppStateComponent<{path: Path}> {
  private store: Store;
  private initialStoreItems: Item[] = this.activeProfile.getStoreItems();

  checkItemsBeforeContinue () {
    return this.appState.popups.prompt(
      <Prompt
        query={"You haven't purchased much food for your expedition. " +
        "It's recommended to take at least 8 food for this quest. Still Embark?"}
      />
    ).then((willEmbark) => {
      if (willEmbark) {
        this.store.purchase();
        this.selectedQuest.status = QuestStatus.Started;
        this.activeProfile.sendLineupOnQuest(this.selectedQuest);
        return true;
      }
    });
  }

  render () {
    return (
      <EstateTemplate
        background={require("../../../assets/dd/images/campaign/town/provision/provision.background.png")}
        path={this.props.path}
        backPath="estateDungeons"
        roster={false}
        inventory={false}
        continueCheck={() => this.checkItemsBeforeContinue()}
        continueLabel="Embark"
        continuePath="dungeonOverview">
        <Popup classStyle={styles.fakePopup}>
          <BuildingOverview info={StaticState.instance.buildings.get("provision")}>
            <Store
              ref={(store) => this.store = store}
              initialStoreItems={this.initialStoreItems}
              profile={this.activeProfile}
            />
          </BuildingOverview>
        </Popup>
        <LineupDropbox profile={this.activeProfile} lock/>
      </EstateTemplate>
    );
  }
}

const styles = StyleSheet.create({
  fakePopup: {
    marginTop: -popupOffset,
    marginLeft: -popupOffset
  }
});
