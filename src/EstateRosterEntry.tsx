import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {Hero} from "./ProfileState";
import {observer} from "mobx-react";
import {HeroLevel} from "./HeroLevel";
import {ItemLevel} from "./ItemLevel";
import {StressMeter} from "./StressMeter";
import {Avatar} from "./Avatar";
import {commonStyles} from "./config/styles";
import {TooltipArea, TooltipSide} from "./TooltipArea";
import {HeroBreakdown} from "./HeroBreakdown";
import {ItemType} from "./StaticState";

@observer
export class EstateRosterEntry extends React.Component<{
  hero: Hero,
  partyFeatures?: boolean,
  canJoinParty?: boolean,
  onSelect?: () => void
}> {
  render () {
    const hero = this.props.hero;

    let extraStyle;
    let partyElement;

    if (this.props.partyFeatures) {
      if (hero.inParty) {
        extraStyle = styles.entryInParty;
        partyElement = <div className={css(styles.partyIcon)}/>;
      } else if (this.props.canJoinParty) {
        partyElement = (
          <button
            onClick={(e) => e.stopPropagation() || (hero.inParty = true)}>
            JOIN
          </button>
        );
      }
    }

    return (
      <li className={css(styles.entry, extraStyle)}
          onClick={this.props.onSelect}>
        <Avatar src={hero.classInfo.avatarUrl}>
          {partyElement}
        </Avatar>
        <div className={css(styles.info)}>
          <span className={css(commonStyles.heroName)}>
            {hero.name}
          </span>
          <StressMeter
            classStyle={styles.stress}
            percentage={hero.stressPercentage}
          />
          <div className={css(styles.equipment)}>
            <ItemLevel type={ItemType.Armor} level={1}/>
            <ItemLevel type={ItemType.Weapon} level={1}/>
          </div>
        </div>
        <TooltipArea
          side={TooltipSide.Left}
          tip={<HeroBreakdown hero={this.props.hero}/>}
        >
          <HeroLevel hero={hero}/>
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

  entryInParty: {
    opacity: 0.5
  },

  partyIcon: {
    width: 10,
    height: 20,
    background: "red"
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
