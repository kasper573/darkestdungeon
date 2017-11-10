import * as React from "react";
import {Character} from "./ProfileState";
import {observer} from "mobx-react";
import {Popup, PopupProps} from "./Popups";

@observer
export class CharacterInfo extends React.Component<
  PopupProps & {
  character: Character
}> {
  render () {
    const {character, ...rest} = this.props;
    return (
      <Popup {...rest}>
        <div>{character.name}</div>
        <br/>
        <h1>Trinkets:</h1>
        <ul>
          {character.trinkets.map((trinket) => (
            <li key={trinket.id}>{trinket.name}</li>
          ))}
        </ul>
      </Popup>
    );
  }
}
