import {css, StyleSheet} from "aphrodite";
import * as React from "react";
import {observer} from "mobx-react";
import {Profile} from "../../state/profile/Profile";

@observer
export class ProfileEntry extends React.Component<{
  profile?: Profile,
  isLast?: boolean,
  onDelete?: () => void,
  onSelect: () => void
}> {
  private inputNode: HTMLInputElement;

  editName (): Promise<string> {
    return new Promise ((resolve) => {
      this.inputNode.focus();
      this.inputNode.selectionStart = this.inputNode.value.length;

      const finish = () => {
        this.inputNode.onblur = null;
        this.inputNode.onkeydown = null;
        resolve(this.inputNode.value);
      };

      this.inputNode.onblur = finish;
      this.inputNode.onkeydown = (e) => {
        if (e.key === "Enter") {
          finish();
        }
      };
    });
  }

  private getProfileInfo (profile: Profile) {
    if (!profile.hasBegun) {
      return [];
    }

    return [
      profile.path.toString(),
      "Week " + profile.week,
      profile.dateOfLastSave.toDateString()
    ];
  }

  render () {
    const isEmptySlot = !this.props.profile;
    const hasProfile = !!this.props.profile;
    const canDelete = hasProfile && this.props.profile.isNameFinalized;
    const isInputFieldDisabled = !hasProfile || this.props.profile.isNameFinalized;

    const infoElements = hasProfile &&
      this.getProfileInfo(this.props.profile).map(
        (str: string, index: number) => <span key={index}>{str}</span>
      );

    return (
      <li className={css(styles.entry, this.props.isLast && styles.lastEntry)}>
        <div className={css(styles.letter)}>
          [{isEmptySlot ? "AVAILABLE" : "TAKEN"}]
        </div>
        <div className={css(styles.selectArea)} onClick={() => this.props.onSelect()}>
          <div className={css(styles.difficulty)}>
            {hasProfile && `[${this.props.profile.difficulty}]`}
          </div>
          <div className={css(styles.inputFieldContainer)}
               onClick={(e) => e.stopPropagation() || this.props.onSelect()}>
            <input
              ref={(node) => this.inputNode = node}
              className={css(styles.inputField, isInputFieldDisabled && styles.inputFieldDisabled)}
              defaultValue={isEmptySlot ? "" : this.props.profile.name}
              placeholder="Click to begin..."
              disabled={isInputFieldDisabled}
              onChange={() => true}
            />
          </div>
          <div className={css(styles.infoBox)}>
            {infoElements}
          </div>
        </div>
        <div className={css(styles.delete)}>
          {canDelete && (
            <span onClick={this.props.onDelete}>[Delete]</span>
          )}
        </div>
      </li>
    );
  }
}

export const entryHeight = 60;
export const entrySpacing = 5;

const styles = StyleSheet.create({
  entry: {
    flexDirection: "row",
    height: entryHeight,
    marginBottom: entrySpacing,
  },

  lastEntry: {
    marginBottom: 0
  },

  letter: {

  },

  selectArea: {
    backgroundColor: "gray",
    flexDirection: "row",
    ":hover": {
      boxShadow: "0px 0px 5vw red",
    }
  },

  difficulty: {

  },

  inputFieldContainer: {
    justifyContent: "center",
  },

  inputField: {

  },

  inputFieldDisabled: {
    pointerEvents: "none"
  },

  delete: {

  },

  infoBox: {

  }
});
