import * as React from "react";
import {StyleSheet} from "aphrodite";
import {CharacterModel} from "../../ui/CharacterModel";
import {Row} from "../../config/styles";
import {CurioModel} from "../../ui/CurioModel";
import {Hero} from "../../state/types/Hero";
import {observer} from "mobx-react";
import {Quest} from "../../state/types/Quest";
import {DungeonSelections} from "./DungeonSelections";
import {Character} from "../../state/types/Character";
import {contains} from "../../lib/Helpers";

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

        <CurioModel />

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

@observer
class CharacterGroup extends React.Component<{
  quest: Quest,
  characters: Character[],
  selections: DungeonSelections,
  reverse?: boolean,
  onCharacterRightClick?: (c: Character) => void
}> {
  static defaultProps = {
    onCharacterRightClick: (): null => null
  };

  render () {
    const quest = this.props.quest;
    const selections = this.props.selections;
    const visibleCharacterOrder = this.props.reverse ?
      this.props.characters.slice().reverse() :
      this.props.characters;

    return (
      <Row>
        {visibleCharacterOrder.map((character) => {
          const highlight = quest.inBattle ?
            character === quest.turnActor :
            character === selections.hero;

          let onClick: () => void;
          let onMouseEnter: () => void;
          let onMouseLeave: () => void;
          let target: boolean;

          if (quest.inBattle) {
            if (quest.canHeroAct && selections.skill) {
              const targetCharacters = selections.skill.info.target.select(quest.allies, quest.enemies);
              target = contains(targetCharacters, character);
              if (target) {
                onClick = () => quest.performTurnAction(selections.skill, [character]);
              }
            }
          } else if (character instanceof Hero) {
            onClick = () => selections.selectHero(character);
          }

          if (!(character instanceof Hero)) {
            onMouseEnter = () => selections.selectEnemy(character);
            onMouseLeave = () => selections.selectEnemy(null);
          }

          return (
            <CharacterModel
              onClick={onClick}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onRightClick={this.props.onCharacterRightClick.bind(this, character)}
              key={character.id}
              character={character}
              highlight={highlight}
              target={target}>
              {quest.getActorIndex(character)}
            </CharacterModel>
          );
        })}
      </Row>
    );
  }
}
