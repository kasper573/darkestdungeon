import * as React from "react";
import {Character} from "./ProfileState";
import {observer} from "mobx-react";
import {css, StyleSheet} from "aphrodite";
import {commonStyles} from "./config/styles";

@observer
export class CharacterInfoSmall extends React.Component<{character: Character}> {
  render () {
    const c = this.props.character;

    const afflictionItem = c.affliction && (
      <li className={css(commonStyles.afflictionText)}>
        Affliction: {c.affliction.name}
      </li>
    );

    const experience = c.level.isMax ? "MAX" : (
      <span>
        {c.relativeExperience}/{c.level.next.relativeExperience}
      </span>
    );

    return (
      <ul className={css(styles.container)}>
        <li>{c.classInfo.name} (Level {c.level.number})</li>
        <li style={{flexDirection: "row"}}>
          Resolve XP: {experience}
        </li>
        {afflictionItem}
        <li>Stress {c.stress}/{c.stressMax}</li>
      </ul>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 200
  }
});
