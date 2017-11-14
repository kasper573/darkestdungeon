import * as React from "react";
import {AppState} from "./AppState";
import {Path} from "./RouterState";
import {css, StyleSheet} from "aphrodite";
import {CommonHeader} from "./CommonHeader";
import {DungeonResultHeroes} from "./DungeonResultHeroes";
import {DungeonResultItems} from "./DungeonResultItems";
import {observable} from "mobx";
import {observer} from "mobx-react";

@observer
export class DungeonResult extends React.Component<{state: AppState}> {
  @observable slide = Slide.Items;

  componentWillMount () {
    this.props.state.ambience.activate("dungeonResult");
  }

  render () {
    const profile = this.props.state.profiles.activeProfile;
    const quest = profile.selectedQuest;

    const slideContent = this.slide === Slide.Items ?
      <DungeonResultItems popups={this.props.state.popups} quest={quest}/> :
      <DungeonResultHeroes popups={this.props.state.popups} party={profile.party}/>;

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

  returnToEstate () {
    this.props.state.profiles.activeProfile.gotoNextWeek(
      this.props.state.questGenerator
    );
    this.props.state.router.goto(
      new Path("loading", {target: "estateOverview"})
    );
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
