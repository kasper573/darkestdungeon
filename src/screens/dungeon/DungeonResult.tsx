import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {CommonHeader} from "../../ui/CommonHeader";
import {DungeonResultHeroes} from "./DungeonResultHeroes";
import {DungeonResultItems} from "./DungeonResultItems";
import {action, observable} from "mobx";
import {observer} from "mobx-react";
import {AppStateComponent} from "../../AppStateComponent";

@observer
export class DungeonResult extends AppStateComponent {
  @observable slide = Slide.Items;

  render () {
    const slideContent = this.slide === Slide.Items ?
      <DungeonResultItems quest={this.selectedQuest}/> :
      <DungeonResultHeroes quest={this.selectedQuest} dungeon={this.selectedDungeon}/>;

    const continueLabel = this.slide === Slide.Items ? "Next" : "Return to Town";
    const continueFn = this.slide === Slide.Items ?
      () => this.slide = Slide.Heroes :
      () => this.returnToEstate();

    return (
      <div className={css(styles.container)}>
        <div>{this.selectedQuest.status}</div>
        <CommonHeader label={this.selectedQuest.info.type}/>

        {slideContent}

        <button onClick={continueFn}>
          {continueLabel}
        </button>
      </div>
    );
  }

  @action
  async returnToEstate () {
    await this.appState.router.goto("estateOverview");

    // Update all state at the very end of the dungeon session
    this.activeProfile.returnPartyFromQuest(this.selectedQuest);
    this.activeProfile.gotoNextWeek();
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
