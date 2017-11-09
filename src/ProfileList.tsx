import * as React from "react";
import {Difficulty, Profile, ProfileId} from "./ProfileState";
import {css, StyleSheet} from "aphrodite";
import {entryHeight, entrySpacing, ProfileEntry} from "./ProfileEntry";
import {AppState} from "./AppState";
import {PopupHandle} from "./PopupState";
import {observer} from "mobx-react";
import {transaction} from "mobx";

@observer
export class ProfileList extends React.Component<{
  state: AppState,
  onProfileSelected: (profile: Profile) => void
}> {
  private entryMap = new Map<ProfileId, ProfileEntry>();
  private listNode: HTMLUListElement;

  promptDelete (profile: Profile) {
    this.props.state.popups.prompt(<DeletePrompt/>)
      .then((isAccepted) =>
        this.props.state.profiles.deleteProfile(profile.id)
      );
  }

  promptCreate () {
    this.props.state.popups.prompt(<CreatePrompt/>)
      .then((difficulty: Difficulty) => {
        const profile = this.props.state.profiles.createProfile(difficulty);

        // Scroll to bottom
        this.listNode.scrollTop = this.listNode.scrollHeight;

        // Start editing name of new entry
        requestAnimationFrame(() => {
          this.entryMap.get(profile.id).editName()
            .then((newName) => {
              transaction(() => {
                profile.name = newName;
                profile.isNameFinalized = true;
              });
            });
        });
      });
  }

  render () {
    const entries = [];
    for (const profile of this.props.state.profiles.map.values()) {
      entries.push(
        <ProfileEntry
          ref={(entry) => this.entryMap.set(profile.id, entry)}
          key={"profile-" + profile.id}
          profile={profile}
          onSelect={() => this.props.onProfileSelected(profile)}
          onDelete={() => this.promptDelete(profile)}
        />
      );
    }

    entries.push(
      <ProfileEntry key="create" onSelect={() => this.promptCreate()} isLast/>
    );

    return (
      <ul ref={(node) => this.listNode = node}
          className={css(styles.list)}>
        {entries}
      </ul>
    );
  }
}

class DeletePrompt extends React.Component<{handle?: PopupHandle}> {
  render () {
    return (
      <div>
        <h1>Are you sure you want to delete this save file?</h1>
        <div style={{flexDirection: "row"}}>
          <button onClick={() => this.props.handle.close(true)}>Yes</button>
          <button onClick={() => this.props.handle.close(false)}>No</button>
        </div>
      </div>
    );
  }
}

class CreatePrompt extends React.Component<{handle?: PopupHandle}> {
  render () {
    const handle = this.props.handle;
    return (
      <div>
        <h1>Select campaign</h1>
        <div style={{flexDirection: "row"}}>
          <button onClick={() => handle.close(Difficulty.Radiant)}>Radiant</button>
          <button onClick={() => handle.close(Difficulty.Darkest)}>Darkest</button>
          <button onClick={() => handle.close(Difficulty.Stygian)}>Stygian</button>
        </div>
      </div>
    );
  }
}

const visibleEntries = 3;
const styles = StyleSheet.create({
  list: {
    height: entryHeight * visibleEntries + entrySpacing * 2,
    overflowY: "scroll"
  },
});
