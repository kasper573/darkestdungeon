import * as React from "react";
import {StyleSheet} from "aphrodite";
import {CharacterModel} from "../../ui/CharacterModel";
import {Row} from "../../config/styles";
import {CurioModel} from "../../ui/CurioModel";
import {Hero} from "../../state/types/Hero";
import {Battle} from "../../state/types/Battle";
import {observer} from "mobx-react";

@observer
export class DungeonScene extends React.Component<{
  party: Hero[],
  selectedHero: Hero,
  battle: Battle,
  onHeroSelected?: (hero: Hero) => void
}> {
  render () {
    return (
      <Row classStyle={styles.scene}>
        <Row classStyle={styles.party}>
          {this.props.party.map((member) => (
            <CharacterModel
              key={member.id}
              character={member}
              highlight={member === this.props.selectedHero}
              onClick={() => this.props.onHeroSelected(member)}
            />
          ))}
        </Row>

        <CurioModel />

        {this.props.battle && (
          <Row classStyle={styles.monsters}>
            {this.props.battle.monsters.map((monster) => (
              <CharacterModel key={monster.id} character={monster}/>
            ))}
          </Row>
        )}
      </Row>
    );
  }
}

const styles = StyleSheet.create({
  scene: {

  },

  party: {

  },

  monsters: {

  }
});
