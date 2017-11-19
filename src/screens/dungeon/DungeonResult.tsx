import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {CommonHeader} from "../../ui/CommonHeader";
import {DungeonResultHeroes} from "./DungeonResultHeroes";
import {DungeonResultItems} from "./DungeonResultItems";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {AppStateComponent} from "../../AppStateComponent";

@observer
export class DungeonResult extends AppStateComponent {
  @observable slide = Slide.Items;

  render () {
    const profile = this.appState.profiles.activeProfile;
    const quest = profile.selectedQuest;

    const slideContent = this.slide === Slide.Items ?
      <DungeonResultItems quest={quest}/> :
      <DungeonResultHeroes party={profile.party}/>;

    const continueLabel = this.slide === Slide.Items ? "Next" : "Return to Town";
    const continueFn = this.slide === Slide.Items ?
      () => this.slide = Slide.Heroes :
      () => this.returnToEstate();

    return (
      <div className={css(styles.container)}>
        <div>{quest.status}</div>
        <CommonHeader label={quest.info.type}/>

        {slideContent}

        <button onClick={continueFn}>
          {continueLabel}
        </button>
      </div>
    );
  }

  async returnToEstate () {
    await this.appState.router.goto("estateOverview");
    this.appState.profiles.activeProfile.gotoNextWeek();
  }
}

enum Slide {
  Items,
  Heroes
}

const styles = StyleSheet.create({
  container: {
    marginLeft: "20%",
    marginRight: "20%",
    flex: 1,
    background: "black",
    alignItems: "center"
  }
});
