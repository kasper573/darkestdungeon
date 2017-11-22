import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {observer} from "mobx-react";
import {HeroLevel} from "../../ui/HeroLevel";
import {ItemLevel} from "../../ui/ItemLevel";
import {StressMeter} from "../../ui/StressMeter";
import {Avatar} from "../../ui/Avatar";
import {commonStyles, Row} from "../../config/styles";
import {TooltipArea, TooltipSide} from "../../lib/TooltipArea";
import {HeroBreakdown} from "../../ui/HeroBreakdown";
import {ItemType} from "../../state/types/ItemInfo";
import {Hero} from "../../state/types/Hero";
import {DragDropSlot} from "../../lib/DragDropSlot";
import {AppStateComponent} from "../../AppStateComponent";
import {ModalState, PopupAlign} from "../../state/PopupState";
import {HeroOverview} from "../../ui/HeroOverview";
import {StaticState} from "../../state/StaticState";

@observer
export class EstateRosterEntry extends AppStateComponent<{
  hero: Hero,
  partyFeatures?: boolean,
  allowDrop?: (item: Hero) => boolean,
  allowDrag?: (item: Hero) => boolean,
  onDragEnd?: () => void,
  onDrop?: (droppedHero: Hero) => void,
  onSelect?: (hero: Hero) => void,
  classStyle?: any
}> {
  showHeroOverview () {
    this.appState.popups.show({
      align: PopupAlign.TopLeft,
      position: {x: 0, y: 0},
      modalState: ModalState.Opaque,
      id: "heroOverview",
      content: <HeroOverview hero={this.props.hero}/>
    });
  }

  render () {
    const hero = this.props.hero;

    let extraStyle;
    let partyElement;
    let residentElement;

    if (this.props.partyFeatures && hero.inParty) {
      extraStyle = styles.entryInParty;
      partyElement = <div className={css(styles.partyIcon)}/>;
    }

    if (hero.residentInfo) {
      const buildingInfo = StaticState.instance.buildingInfoRoot.get(hero.residentInfo.buildingId);
      residentElement = (
        <div>{buildingInfo.name}</div>
      );
    }

    return (
      <DragDropSlot
        type={Hero}
        item={hero}
        classStyle={[styles.entry, this.props.classStyle]}
        allowDrag={this.props.allowDrag}
        allowDrop={this.props.allowDrop}
        onDragEnd={this.props.onDragEnd}
        onClick={() => this.showHeroOverview()}
        onDrop={this.props.onDrop}>
        <Row classStyle={extraStyle}>
          <Avatar src={hero.classInfo.avatarUrl}>
            {partyElement}
            {residentElement}
          </Avatar>
          <div className={css(styles.info)}>
            <span className={css(commonStyles.heroName)}>
              {hero.name}
            </span>
            <StressMeter
              classStyle={styles.stress}
              percentage={hero.stats.stressPercentage}
            />
            <div className={css(styles.equipment)}>
              {hero.armor && <ItemLevel type={ItemType.Armor} level={hero.armor.level}/>}
              {hero.weapon && <ItemLevel type={ItemType.Weapon} level={hero.weapon.level}/>}
            </div>
          </div>
        </Row>
        <TooltipArea
          side={TooltipSide.Left}
          tip={<HeroBreakdown hero={this.props.hero}/>}
        >
          <HeroLevel hero={hero}/>
        </TooltipArea>
      </DragDropSlot>
    );
  }
}

const styles = StyleSheet.create({
  entry: {
    flexDirection: "row",
    border: "2px solid gray",
    backgroundColor: "black",
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
