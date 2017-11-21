import * as React from "react";
import {BuildingInfo} from "../../../state/types/BuildingInfo";
import {count, mapMap} from "../../../lib/Helpers";
import {CommonHeader} from "../../../ui/CommonHeader";
import {Column, Row} from "../../../config/styles";
import {StaticState} from "../../../state/StaticState";
import {observer} from "mobx-react";
import {css, StyleSheet} from "aphrodite";
import {DragDropSlot} from "../../../lib/DragDropSlot";
import {Hero} from "../../../state/types/Hero";
import {Avatar} from "../../../ui/Avatar";
import {GoldText} from "../../../ui/GoldText";
import {AppStateComponent} from "../../../AppStateComponent";
import {Prompt} from "../../../ui/Popups";
import {TooltipArea} from "../../../lib/TooltipArea";

@observer
export class TreatmentSlots extends AppStateComponent<{
  info: BuildingInfo
}> {
  async promptLockInFor (resident: Hero, cost: number) {
    const proceed = await this.appState.popups.prompt(
      <Prompt query={<span>Do you wish to pay <GoldText amount={cost}/> for this residency?</span>}/>
    );
    if (proceed) {
      this.activeProfile.purchaseResidency(resident);
    }
  }

  async promptReleaseFor (resident: Hero) {
    const proceed = await this.appState.popups.prompt(
      <Prompt query="Releasing a resident before treatment has finished won't give you a refund. Proceed?"/>
    );
    if (proceed) {
      resident.leaveResidence();
    }
  }

  render () {
    return (
      <div>
        {mapMap(this.props.info.children, (info) => {
          const unlockedEffects = this.activeProfile.getUpgradeEffects(info.id);
          const maximumSize = StaticState.instance.getUpgradeEffects([info.id]).size;
          return (
            <Row key={info.id}>
              <Column style={{flex: 1}}>
                <CommonHeader label={info.name}/>
                <p>{info.description}</p>
                <p>{unlockedEffects.size} / {maximumSize}</p>
              </Column>
              <Row style={{flex: 3}}>
                {count(maximumSize).map((c, slotIndex) => {
                  const resident = this.activeProfile.findResident(info.id, slotIndex);
                  return (
                    <TreatmentSlot
                      key={slotIndex}
                      goldAvailable={this.activeProfile.gold}
                      goldRequired={unlockedEffects.cost}
                      onRemove={() => resident.leaveResidence()}
                      onInsert={(hero) => hero.enterResidence(info.id, slotIndex)}
                      onLockIn={() => this.promptLockInFor(resident, unlockedEffects.cost)}
                      onRelease={() => this.promptReleaseFor(resident)}
                      resident={resident}
                      isAvailable={slotIndex < unlockedEffects.size}
                    />
                  );
                })}
              </Row>
            </Row>
          );
        })}
      </div>
    );
  }
}

class TreatmentSlot extends React.Component<{
  goldRequired: number,
  goldAvailable: number,
  onRemove: () => void,
  onInsert: (hero: Hero) => void,
  onLockIn: () => void,
  onRelease: () => void,
  isAvailable: boolean,
  resident?: Hero
}> {
  render () {
    return (
      <DragDropSlot
        type={Hero}
        item={this.props.resident}
        classStyle={styles.slotContainer}
        onDragEnd={this.props.onRemove}
        onDrop={this.props.onInsert}
        allowDrag={(hero: Hero) => !hero.residentInfo.isLockedIn}
        allowDrop={(hero: Hero) => !this.props.resident && !shouldRejectHero(hero) && this.props.isAvailable}>
        {(draggedHero: Hero, isOver, isDragging, canDrag, canDrop) => {
          const showCost = canDrop || (this.props.resident && !this.props.resident.residentInfo.isLockedIn);
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
            <div className={css(styles.slotInner, getSlotStyle(draggedHero, this.props.isAvailable))}>
              {this.props.resident && (
                <Row style={{flex: 1}}>
                  <Avatar
                    classStyle={styles.slotAvatar}
                    src={this.props.resident.classInfo.avatarUrl}/>
                  <TooltipArea tip={actionTip}>
                    <button onClick={actionFn}>{actionLabel}</button>
                  </TooltipArea>
                </Row>
              )}
              {showCost && (
                <GoldText amount={this.props.goldRequired} compareWith={this.props.goldAvailable}/>
              )}
            </div>
          );
        }}
      </DragDropSlot>
    );
  }
}

function shouldRejectHero (hero: Hero) {
  return false;
}

function getSlotStyle (hero: Hero, isAvailable: boolean) {
  if (!isAvailable) {
    return styles.slotUnavailable;
  } else if (shouldRejectHero(hero)) {
    return styles.slotRejected;
  }
}

const styles = StyleSheet.create({
  slotContainer: {
    flex: 1,
    border: "2px solid gray",
    marginRight: 5,
    "last-child": {
      marginRight: 0
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
