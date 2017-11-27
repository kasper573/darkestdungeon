import * as React from "react";
import {TooltipArea} from "../../../../lib/TooltipArea";
import {Avatar} from "../../../../ui/Avatar";
import {commonStyleFn, commonStyles, Row} from "../../../../config/styles";
import {css, StyleSheet} from "aphrodite";
import {Hero} from "../../../../state/types/Hero";
import {DragDropSlot} from "../../../../lib/DragDropSlot";
import {grid} from "../../../../config/Grid";
import {GoldIcon} from "../../../../ui/GoldIcon";

export class TreatmentSlot extends React.Component<{
  goldRequired?: number,
  goldAvailable: number,
  onRemove: () => void,
  onInsert: (hero: Hero) => void,
  canHelp: (hero: Hero) => boolean,
  onLockIn: () => void,
  onRelease: () => void,
  isAvailable: boolean,
  resident?: Hero
}> {
  getSlotStyle (residentCandidate: Hero) {
    if (!this.props.isAvailable) {
      return styles.slotUnavailable;
    } else if (!this.props.canHelp(residentCandidate)) {
      return styles.slotRejected;
    }
  }

  render () {
    return (
      <DragDropSlot
        type={Hero}
        item={this.props.resident}
        classStyle={styles.slotContainer}
        onDragEnd={this.props.onRemove}
        onDrop={this.props.onInsert}
        allowDrag={(hero: Hero) => !hero.residentInfo.isLockedIn}
        allowDrop={(hero: Hero) => {
          return !this.props.resident &&
            !(hero.residentInfo && hero.residentInfo.isLockedIn) &&
            this.props.canHelp(hero) &&
            this.props.isAvailable;
        }}>
        {(draggedHero: Hero, isOver, isDragging, canDrag, canDrop) => {
          const showCost = this.props.goldRequired !== undefined && (
            canDrop || (this.props.resident && !this.props.resident.residentInfo.isLockedIn)
          );
          const canAfford = this.props.goldAvailable >= this.props.goldRequired;

          let actionTip;
          let actionFn;
          let actionLabel;
          if (this.props.resident) {
            const info = this.props.resident.residentInfo;
            actionFn = info.isLockedIn ? this.props.onRelease : this.props.onLockIn;
            actionLabel = info.isLockedIn ? "X" : "V";
            actionTip = info.isLockedIn ? "Stop Treatment" : "Start Treatment";
            if (!canAfford && !info.isLockedIn) {
              actionTip = "Not enough gold";
              actionFn = undefined;
            }
          }

          return (
            <div className={css(styles.slotInner, this.getSlotStyle(draggedHero))}>
              {this.props.resident && (
                <Row classStyle={commonStyles.fill}>
                  <Avatar
                    classStyle={styles.slotAvatar}
                    src={this.props.resident.classInfo.avatarUrl}/>
                  <TooltipArea tip={actionTip}>
                    <button onClick={actionFn}>{actionLabel}</button>
                  </TooltipArea>
                </Row>
              )}
              {showCost && (
                <GoldIcon amount={this.props.goldRequired} compareWith={this.props.goldAvailable}/>
              )}
            </div>
          );
        }}
      </DragDropSlot>
    );
  }
}

const styles = StyleSheet.create({
  slotContainer: {
    flex: 1,
    border: commonStyleFn.border(),
    ":not(last-child)": {
      marginRight: grid.gutter / 2
    }
  },

  slotInner: {
    flex: 1
  },

  slotAvatar: {
    flex: "1 auto"
  },

  slotRejected: {
    background: "red"
  },

  slotUnavailable: {
    background: "black"
  }
});
