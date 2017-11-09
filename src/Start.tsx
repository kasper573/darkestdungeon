import * as React from "react";
import {TitleHeader} from "./TitleHeader";
import {AppState} from "./AppState";
import {Path} from "./RouterState";
import {ProfileList} from "./ProfileList";
import {css, StyleSheet} from "aphrodite";
import {Profile} from "./ProfileState";

export class Start extends React.Component<{state: AppState}> {
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
          state={this.props.state}
          onProfileSelected={(profile) => this.onProfileSelected(profile)}
        />
      </div>
    );
  }

  async onProfileSelected (profile: Profile) {
    if (!profile.isNameFinalized) {
      return;
    }

    await this.transitionOut();
    this.props.state.profiles.setActiveProfile(profile.id);
    this.props.state.router.goto(
      new Path("loading", {
        target: profile.path || "dungeon"
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
  }
});
