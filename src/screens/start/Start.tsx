import * as React from "react";
import {TitleHeader} from "../../ui/TitleHeader";
import {ProfileList} from "./ProfileList";
import {css, StyleSheet} from "aphrodite";
import {PauseMenu} from "../../ui/PauseMenu";
import {AppStateComponent} from "../../AppStateComponent";
import {Profile} from "../../state/types/Profile";

export class Start extends AppStateComponent {
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
    this.appState.router.goto(profile.path);
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
