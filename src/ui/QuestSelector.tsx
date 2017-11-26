import * as React from "react";
import {Quest} from "../state/types/Quest";
import {css, StyleSheet} from "aphrodite";

export class QuestSelector extends React.Component<{
  quest: Quest,
  isSelected: boolean,
  onSelected: () => void
}> {
  render () {
    return (
      <span
        onClick={this.props.onSelected}
        className={css(styles.quest, this.props.isSelected && styles.selected)}>
        {this.props.quest.info.type}
      </span>
    );
  }
}

const styles = StyleSheet.create({
  quest: {
    margin: 3
  },

  selected: {
    border: "2px solid black"
  }
});
