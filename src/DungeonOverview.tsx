import * as React from "react";
import {AppState} from "./AppState";
import {Hero, QuestStatus} from "./ProfileState";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {css, StyleSheet} from "aphrodite";
import {DungeonControlPanel} from "./DungeonControlPanel";
import {Torch} from "./Torch";
import {QuestHeader} from "./QuestHeader";
import {DungeonScene} from "./DungeonScene";

@observer
export class DungeonOverview extends React.Component<{state: AppState}> {
  @observable selectedHero: Hero = Array.from(
    this.props.state.profiles.activeProfile.party
  )[0];

  componentWillMount () {
    this.props.state.ambience.activate("dungeonOverview");
  }

  render () {
    const profile = this.props.state.profiles.activeProfile;
    const quest = profile.selectedQuest;
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.scene)}>
          <QuestHeader quest={quest} onLeaveRequested={(status) => this.finish(status)}/>
          <Torch popups={this.props.state.popups} quest={quest}/>
          <DungeonScene profile={profile} popups={this.props.state.popups}/>
        </div>

        <DungeonControlPanel
          selectedHero={this.selectedHero}
          state={this.props.state}
        />
      </div>
    );
  }

  finish (status: QuestStatus) {
    this.props.state.profiles.activeProfile.selectedQuest.status = status;
    this.props.state.router.goto("dungeonResult");
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  scene: {
    flex: 1
  }
});
