import * as React from "react";
import {Row} from "../../config/styles";
import {CurioModel} from "../../ui/CurioModel";
import {Hero} from "../../state/types/Hero";
import {observer} from "mobx-react";
import {Quest} from "../../state/types/Quest";
import {DungeonSelections} from "./DungeonSelections";
import {CharacterGroup} from "./CharacterGroup";

@observer
export class DungeonScene extends React.Component<{
  quest: Quest,
  selections: DungeonSelections,
  onHeroOverviewRequested: (hero: Hero) => void
}> {
  render () {
    return (
      <Row>
        <CharacterGroup
          quest={this.props.quest}
          selections={this.props.selections}
          characters={this.props.quest.party}
          onCharacterRightClick={this.props.onHeroOverviewRequested}
        />

        {this.props.quest.currentRoom.curios.map((curio) =>
          <CurioModel
            key={curio.id}
            curio={curio}
            inventory={this.props.quest.items}
            selections={this.props.selections}
            isInteractionEnabled={!this.props.quest.inBattle}
          />
        )}

        {this.props.quest.inBattle && (
          <CharacterGroup
            quest={this.props.quest}
            selections={this.props.selections}
            characters={this.props.quest.enemies}
            reverse
          />
        )}
      </Row>
    );
  }
}
