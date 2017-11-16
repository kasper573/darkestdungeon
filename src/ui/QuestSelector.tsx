import * as React from "react";
import {Quest} from "../state/types/Quest";

export class QuestSelector extends React.Component<{
  quest: Quest,
  isSelected: boolean,
  onSelected: () => void
}> {
  render () {
    return (
      <span
        onClick={this.props.onSelected}
        style={{
          margin: 3,
          border: this.props.isSelected ? "2px solid black" : undefined
        }}>
        {this.props.quest.info.type}
      </span>
    );
  }
}
