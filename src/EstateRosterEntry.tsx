import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {Character} from "./ProfileState";
import {observer} from "mobx-react";
import {CharacterLevel} from "./CharacterLevel";
import {ItemLevel} from "./ItemLevel";
import {StressMeter} from "./StressMeter";
import {Avatar} from "./Avatar";
import {commonStyles} from "./config/styles";
import {TooltipArea, TooltipSide} from "./TooltipArea";
import {CharacterBreakdown} from "./CharacterBreakdown";
import {PopupState} from "./PopupState";
import {ItemType} from "./config/general";

@observer
export class EstateRosterEntry extends React.Component<{
  character: Character,
  popups: PopupState,
  onSelect?: () => void
}> {
  render () {
    const character = this.props.character;
    return (
      <li className={css(styles.entry)} onClick={this.props.onSelect}>
        <Avatar src={character.classInfo.avatarUrl}/>
        <div className={css(styles.info)}>
          <span className={css(commonStyles.characterName)}>
            {character.name}
          </span>
          <StressMeter
            className={css(styles.stress)}
            percentage={character.stressPercentage}
          />
          <div className={css(styles.equipment)}>
            <ItemLevel type={ItemType.Armor} level={1}/>
            <ItemLevel type={ItemType.Weapon} level={1}/>
          </div>
        </div>
        <TooltipArea
          popups={this.props.popups}
          side={TooltipSide.Left}
          tip={<CharacterBreakdown character={this.props.character}/>}
        >
          <CharacterLevel character={character}/>
        </TooltipArea>
      </li>
    );
  }
}

const styles = StyleSheet.create({
  entry: {
    flexDirection: "row",
    border: "2px solid gray",
    backgroundColor: "black",
    marginBottom: 10,
    overflow: "hidden",
    padding: 2
  },

  info: {
    marginLeft: 10,
    marginRight: 10
  },

  stress: {
    marginTop: 3,
    marginBottom: 3
  },

  equipment: {
    flexDirection: "row"
  }
});
