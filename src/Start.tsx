import * as React from "react";
import {TitleHeader} from "./TitleHeader";
import {AppState} from "./AppState";
import {Path} from "./RouterState";
import {ProfileList} from "./ProfileList";
import {css, StyleSheet} from "aphrodite";

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
          onProfileSelected={() => this.onProfileSelected()}
        />
      </div>
    );
  }

  onProfileSelected () {
    this.transitionOut().then(() =>
      this.props.state.router.goto(
        new Path("loading", {target: "estateOverview"})
      )
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
