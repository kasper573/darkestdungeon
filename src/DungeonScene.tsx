import * as React from "react";
import {Character, Profile} from "./ProfileState";
import {StaticState} from "./StaticState";
import {randomizeItem} from "./Generators";
import {StyleSheet} from "aphrodite";
import {CharacterModel} from "./CharacterModel";
import {Row} from "./config/styles";
import {CurioModel} from "./CurioModel";
import {PopupState} from "./PopupState";

export class DungeonScene extends React.Component<{
  popups: PopupState,
  profile: Profile
}> {
  monsters: Character[];

  componentWillMount () {
    // TODO remove all this
    const monsterClasses = Array.from(StaticState.instance.heroClasses.values());

    const monster1 = new Character();
    monster1.name = "Foo";
    monster1.classInfo = randomizeItem(monsterClasses);

    const monster2 = new Character();
    monster2.name = "Bar";
    monster2.classInfo = randomizeItem(monsterClasses);

    this.monsters = [
      monster1,
      monster2
    ];
  }

  render () {
    return (
      <Row classStyle={styles.scene}>
        <Row classStyle={styles.party}>
          {this.props.profile.party.map((member) => (
            <CharacterModel key={member.id} popups={this.props.popups} character={member}/>
          ))}
        </Row>

        <CurioModel popups={this.props.popups}/>

        <Row classStyle={styles.monsters}>
          {this.monsters.map((monster) => (
            <CharacterModel key={monster.id} popups={this.props.popups} character={monster}/>
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
