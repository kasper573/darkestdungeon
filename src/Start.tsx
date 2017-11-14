import * as React from "react";
import {TitleHeader} from "./TitleHeader";
import {Path} from "./RouterState";
import {ProfileList} from "./ProfileList";
import {css, StyleSheet} from "aphrodite";
import {Profile} from "./ProfileState";
import {PauseMenu} from "./PauseMenu";
import {AppStateComponent} from "./AppStateComponent";

export class Start extends AppStateComponent {
  componentWillMount () {
    this.appState.ambience.activate("start");
  }

  transitionOut () {
    console.warn("Not implemented");
    return Promise.resolve();
  }

  render () {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.topArea)}>
          <TitleHeader/>
        </div>
        <ProfileList
          onProfileSelected={(profile) => this.onProfileSelected(profile)}
        />
        <span
          className={css(styles.bottomRightIcons)}
          onClick={() =>
            this.appState.popups.show(
              <PauseMenu mainMenu={false}/>
            )
          }
        >
          [PAUSE MENU]
        </span>
      </div>
    );
  }

  async onProfileSelected (profile: Profile) {
    if (!profile.isNameFinalized) {
      return;
    }

    await this.transitionOut();
    this.appState.profiles.setActiveProfile(profile.id);
    this.appState.router.goto(
      new Path("loading", {
        target: profile.path || "dungeonOverview"
      })
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 40
  },

  topArea: {
    flex: 1
  },

  bottomRightIcons: {
    position: "absolute",
    bottom: 0, right: 0
  }
});
