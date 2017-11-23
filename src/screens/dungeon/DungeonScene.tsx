import * as React from "react";
import {StyleSheet} from "aphrodite";
import {CharacterModel} from "../../ui/CharacterModel";
import {Row} from "../../config/styles";
import {CurioModel} from "../../ui/CurioModel";
import {Profile} from "../../state/types/Profile";
import {QuestRoom} from "../../state/types/QuestRoom";
import {Hero} from "../../state/types/Hero";

export class DungeonScene extends React.Component<{
  profile: Profile,
  room: QuestRoom,
  onHeroSelected?: (hero: Hero) => void
}> {
  render () {
    return (
      <Row classStyle={styles.scene}>
        <Row classStyle={styles.party}>
          {this.props.profile.party.map((member) => (
            <CharacterModel
              key={member.id}
              character={member}
              onClick={() => this.props.onHeroSelected(member)}
            />
          ))}
        </Row>

        <CurioModel />

        <Row classStyle={styles.monsters}>
          {this.props.room.monsters.map((monster) => (
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
