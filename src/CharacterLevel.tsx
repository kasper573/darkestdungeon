import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {commonStyles} from "./config/styles";
import {Character} from "./ProfileState";
import {observer} from "mobx-react";

@observer
export class CharacterLevel extends React.Component<{
  character: Character
}> {
  render () {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.level)}>{this.props.character.level.number}</div>
        <div className={css(styles.progressContainer, commonStyles.boxBorder)}>
          <div
            className={css(styles.progressFill)}
            style={{height: (this.props.character.levelProgress * 100) + "%"}}
          />
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 20
  },

  level: {
    height: 20,
    backgroundColor: "gray",
    borderRadius: 10,
    color: "black",
    justifyContent: "center",
    alignItems: "center"
  },

  progressContainer: {
    backgroundColor: "black",
    height: 40,
    justifyContent: "flex-end"
  },

  progressFill: {
    backgroundColor: "white",
    width: "100%"
  }
});
