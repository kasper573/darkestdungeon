
import * as React from "react";
import {css} from "aphrodite";
import {commonStyles, Row} from "../config/styles";
import {QuestSelector} from "./QuestSelector";
import {Quest, QuestId} from "../state/types/Quest";

export class DungeonBreakdown extends React.Component<{
  name: string,
  level: number,
  progress: number,
  quests: Quest[],
  selectedQuestId: QuestId,
  onQuestSelected: (q: Quest) => void
}> {
  static defaultProps: any = {
    quests: []
  };

  render () {
    return (
      <div>
        <Row>
          <span className={css(commonStyles.commonName)}>{this.props.name}</span>
          <span>Level {this.props.level}</span>
          <span>({Math.round(this.props.progress * 100)}%)</span>
        </Row>
        <Row>
          {this.props.quests.map((quest) =>
            <QuestSelector
              key={quest.id}
              quest={quest}
              isSelected={this.props.selectedQuestId === quest.id}
              onSelected={() => this.props.onQuestSelected(quest)}
            />
          )}
        </Row>
      </div>
    );
  }
}
