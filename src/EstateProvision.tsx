import * as React from "react";
import {AppState} from "./AppState";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "./RouterState";
import {Prompt} from "./Popups";
import {BuildingOverview} from "./BuildingOverview";
import {StyleSheet} from "aphrodite";
import {PartyDropbox} from "./PartyDropbox";
import {Item, QuestStatus} from "./ProfileState";
import {observer} from "mobx-react";
import {Store} from "./Store";

@observer
export class EstateProvision extends React.Component<{
  state: AppState,
  path: Path
}> {
  private store: Store;
  private initialStoreItems: Item[] =
    this.props.state.profiles.activeProfile.generateStoreItems(
      this.props.state.itemGenerator
    );

  componentWillMount () {
    this.props.state.ambience.activate("estateProvision");
  }

  checkItemsBeforeContinue () {
    return this.props.state.popups.prompt(
      <Prompt
        query={"You haven't purchased much food for your expedition. " +
        "It's recommended to take at least 8 food for this quest. Still Embark?"}
      />
    ).then((willEmbark) => {
      if (willEmbark) {
        this.store.checkout();
        this.props.state.profiles.activeProfile.selectedQuest.status = QuestStatus.Started;
        return true;
      }
    });
  }

  render () {
    const profile = this.props.state.profiles.activeProfile;
    return (
      <EstateTemplate
        state={this.props.state}
        path={this.props.path}
        backPath="estateDungeons"
        roster={false}
        continueCheck={() => this.checkItemsBeforeContinue()}
        continueLabel="Embark"
        continuePath={new Path("loading", {target: "dungeonOverview"})}>
        <BuildingOverview
          classStyle={styles.container}
          popups={this.props.state.popups}
          header="Provision"
          backgroundUrl={require("../assets/images/provision-bg.jpg")}>
          <Store
            ref={(store) => this.store = store}
            initialStoreItems={this.initialStoreItems}
            popups={this.props.state.popups}
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
