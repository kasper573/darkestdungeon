import * as React from "react";
import {Character, Profile, Trinket} from "./ProfileState";
import {observer} from "mobx-react";
import {Popup, PopupProps} from "./Popups";
import {computed} from "mobx";

@observer
export class CharacterInfo extends React.Component<
  PopupProps & {
  profile: Profile,
  character: Character
}> {
  @computed get characterTrinkets () {
    return this.props.profile.trinkets.filter(
      (trinket: Trinket) => trinket.characterId === this.props.character.id
    );
  }

  render () {
    const {character, ...rest} = this.props;
    return (
      <Popup {...rest}>
        <div>{character.name}</div>
        <br/>
        <h1>Trinkets:</h1>
        <ul>
          {this.characterTrinkets.map((trinket) => (
            <li key={trinket.id}>{trinket.itemInfo.name}</li>
          ))}
        </ul>
      </Popup>
    );
  }
}
