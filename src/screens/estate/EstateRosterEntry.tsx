import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {observer} from "mobx-react";
import {LevelIcon} from "../../ui/LevelIcon";
import {ItemLevel} from "../../ui/ItemLevel";
import {StressMeter} from "../../ui/StressMeter";
import {Avatar} from "../../ui/Avatar";
import {commonStyleFn, commonStyles} from "../../config/styles";
import {TooltipArea, TooltipSide} from "../../lib/TooltipArea";
import {HeroBreakdown} from "../../ui/HeroBreakdown";
import {ItemType} from "../../state/types/ItemInfo";
import {Hero} from "../../state/types/Hero";
import {DragDropSlot} from "../../lib/DragDropSlot";
import {AppStateComponent} from "../../AppStateComponent";
import {ModalState, PopupAlign, PopupHandle} from "../../state/PopupState";
import {HeroOverview} from "../../ui/HeroOverview";
import {StaticState} from "../../state/StaticState";
import {estateContentPosition} from "./EstateTemplate";
import {grid} from "../../config/Grid";
import {Icon} from "../../ui/Icon";
import {Prompt} from "../../ui/Popups";

const inLineupIconUrl = require("../../../assets/dd/images/campaign/town/roster/party.icon_roster.png");

const sounds = {
  dismiss: {src: require("../../../assets/dd/audio/ui_town_char_remove.wav")}
};

@observer
export class EstateRosterEntry extends AppStateComponent<{
  hero: Hero,
  index?: number,
  lineupFeatures?: boolean,
  transparent?: boolean,
  allowDrop?: (item: Hero) => boolean,
  allowDrag?: (item: Hero) => boolean,
  onDragEnd?: (item: Hero, monitor: any) => void,
  onDrop?: (droppedHero: Hero) => void,
  classStyle?: any,

  // Hover offset settings
  isShownInOverview?: boolean,
  enableHoverOffset?: boolean,
  onOverviewOpened?: () => void,
  onOverviewClosed?: () => void
}> {
  static defaultProps = {
    index: 0
  };

  async promptDismissHero (popup: PopupHandle) {
    const proceed = await this.appState.popups.prompt(
      <Prompt
        query="This will delete this hero permanently. Are you sure you want to dismiss this hero?"
        yesSound={sounds.dismiss}
      />
    );

    if (proceed) {
      this.activeProfile.dismissHero(this.props.hero);
      popup.close();
    }
  }

  showHeroOverview () {
    const handle: PopupHandle = this.appState.popups.show({
      align: PopupAlign.TopLeft,
      position: estateContentPosition,
      modalState: ModalState.Opaque,
      id: "heroOverview",
      onClose: this.props.onOverviewClosed,
      content: (
        <HeroOverview
          hero={this.props.hero}
          onDismissRequested={() => this.promptDismissHero(handle)}
        />
      )
    });

    if (this.props.onOverviewOpened) {
      this.props.onOverviewOpened();
    }
  }

  render () {
    const hero = this.props.hero;

    let overlayIconUrl;

    if (this.props.lineupFeatures && hero.inLineup) {
      overlayIconUrl = inLineupIconUrl;
    } else if (hero.residentInfo) {
      const buildingInfo = StaticState.instance.buildingInfoRoot.get(hero.residentInfo.buildingId);
      overlayIconUrl = buildingInfo.parent.iconUrl;
    }

    const dynamicStyles = [];
    if (this.props.enableHoverOffset) {
      dynamicStyles.push(styles.entryOffsetable);
      if (this.props.isShownInOverview) {
        dynamicStyles.push(styles.entryOffsetForced);
      }
    }
    if (this.props.transparent) {
      dynamicStyles.push(styles.entryTransparent);
    }

    return (
      <DragDropSlot
        type={Hero}
        item={hero}
        classStyle={[styles.entry, ...dynamicStyles, this.props.classStyle]}
        style={{borderColor: borderColors[this.props.index % 2]}}
        allowDrag={this.props.allowDrag}
        allowDrop={this.props.allowDrop}
        onDragEnd={this.props.onDragEnd}
        onDrop={this.props.onDrop}>
        <div
          className={css(commonStyles.row)}
          onContextMenu={(e) => {
            e.preventDefault();
            this.showHeroOverview();
            return false;
          }}>
          <Avatar
            classStyle={[styles.avatar, overlayIconUrl ? styles.avatarDimmed : false]}
            src={hero.classInfo.avatarUrl}
          />
          {overlayIconUrl && (
            <Icon
              src={overlayIconUrl}
              classStyle={styles.overlayIcon}
            />
          )}
          <div className={css(styles.info)}>
            <span className={css(commonStyles.commonName)}>
              {hero.name}
            </span>
            <StressMeter
              classStyle={styles.stress}
              percentage={hero.stats.stressPercentage}
            />
            <div className={css(commonStyles.fill)}/>
            <div className={css(styles.equipment)}>
              {hero.armor && <ItemLevel type={ItemType.Armor} level={hero.armor.level}
                                        style={{marginRight: grid.border}}/>}
              {hero.weapon && <ItemLevel type={ItemType.Weapon} level={hero.weapon.level}/>}
            </div>
          </div>
        </div>
        <TooltipArea
          side={TooltipSide.Left}
          classStyle={styles.levelIconContainer}
          tip={<HeroBreakdown hero={this.props.hero}/>}>
          <LevelIcon exp={hero}/>
        </TooltipArea>
      </DragDropSlot>
    );
  }
}

const borderColors = [
  "rgb(33,33,33)",
  "rgb(68, 72, 79)"
];

export const rosterEntryHoverOffset = grid.xSpan(0.5);
const entryHeight = grid.ySpan(1.75);
const entryBorderSize = grid.border;
const entryPadding = grid.border;
export const rosterEntryAvatarSize = entryHeight - entryBorderSize * 2 - entryPadding * 2;
const styles = StyleSheet.create({
  entry: {
    flexDirection: "row",
    border: commonStyleFn.border(undefined, entryBorderSize),
    borderRight: 0,
    backgroundColor: "black",
    padding: entryPadding,
    height: entryHeight
  },

  entryTransparent: {
    background: "transparent",
    border: 0
  },

  entryOffsetable: {
    transition: "margin-left 0.2s ease-out",
    ":hover": {
      marginLeft: -rosterEntryHoverOffset
    }
  },

  entryOffsetForced: {
    marginLeft: -rosterEntryHoverOffset
  },

  lineupIcon: {
    width: 10,
    height: 20,
    background: "red"
  },

  avatar: {
    width: rosterEntryAvatarSize,
    height: rosterEntryAvatarSize
  },

  avatarDimmed: {
    opacity: 0.5
  },

  overlayIcon: {
    ...commonStyleFn.dock("left"),
    width: rosterEntryAvatarSize,
    height: rosterEntryAvatarSize
  },

  info: {
    margin: grid.gutter,
    width: grid.xSpan(1.5)
  },

  stress: {
    marginTop: grid.border,
    marginBottom: grid.border
  },

  equipment: {
    flexDirection: "row"
  },

  levelIconContainer: {
    margin: grid.gutter,
    marginLeft: 0,
    paddingRight: rosterEntryHoverOffset,
    marginRight: grid.gutter - rosterEntryHoverOffset,
    justifyContent: "flex-end"
  }
});
