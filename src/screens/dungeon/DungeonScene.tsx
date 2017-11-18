import * as React from "react";
import {StyleSheet} from "aphrodite";
import {CharacterModel} from "../../ui/CharacterModel";
import {Row} from "../../config/styles";
import {CurioModel} from "../../ui/CurioModel";
import {Profile} from "../../state/types/Profile";
import {Character} from "../../state/types/Character";
import {AppStateComponent} from "../../AppStateComponent";
import {MonsterGenerator} from "../../state/Generators";

export class DungeonScene extends AppStateComponent<{
  profile: Profile
}> {
  monsters: Character[];

  componentWillMount () {
    // TODO remove all this
    const dungeon = this.appState.profiles.activeProfile.selectedDungeon;
    const monsterGenerator = new MonsterGenerator();
    this.monsters = [];
    this.monsters.push(monsterGenerator.next(dungeon.info, this.monsters));
    this.monsters.push(monsterGenerator.next(dungeon.info, this.monsters));
  }

  render () {
    return (
      <Row classStyle={styles.scene}>
        <Row classStyle={styles.party}>
          {this.props.profile.party.map((member) => (
            <CharacterModel key={member.id} character={member}/>
          ))}
        </Row>

        <CurioModel />

        <Row classStyle={styles.monsters}>
          {this.monsters.map((monster) => (
            <CharacterModel key={monster.id} character={monster}/>
          ))}
        </Row>
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
