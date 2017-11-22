import * as React from "react";
import {Hero} from "../../../state/types/Hero";
import {Column, commonStyles, Row} from "../../../config/styles";
import {HeroUpgradeType} from "./HeroUpgradeShop";
import {css, StyleSheet} from "aphrodite";
import {AppStateComponent} from "../../../AppStateComponent";
import {StaticState} from "../../../state/StaticState";
import {BuildingInfo} from "../../../state/types/BuildingInfo";
import {compact, count} from "../../../lib/Helpers";
import {computed} from "mobx";
import {observer} from "mobx-react";
import {Skill} from "../../../state/types/Skill";
import {Item} from "../../../state/types/Item";
import {ItemIcon} from "../../../ui/ItemIcon";
import {SkillIcon} from "../../../ui/SkillIcon";
import {BuildingUpgradeEffects} from "../../../state/types/BuildingUpgradeEffects";
import {TooltipArea, TooltipSide} from "../../../lib/TooltipArea";
import {UpgradeTooltip} from "./UpgradeTooltip";
import {GoldText} from "../../../ui/GoldText";
import {Prompt} from "../../../ui/Popups";

@observer
export class HeroUpgradeGrid extends AppStateComponent<{
  type: HeroUpgradeType,
  info: BuildingInfo,
  hero: Hero
}> {
  @computed get upgradeDescription () {
    switch (this.props.type) {
      case HeroUpgradeType.Equipment:
        return this.props.hero.classInfo.equipmentDescription;
      case HeroUpgradeType.Skills:
        return this.props.hero.classInfo.skillDescription;
    }
  }

  @computed get upgradeTargets (): Array<Item | Skill> {
    switch (this.props.type) {
      case HeroUpgradeType.Equipment:
        return compact([
          this.props.hero.weapon,
          this.props.hero.armor
        ]);
      case HeroUpgradeType.Skills:
        return this.props.hero.skills;
    }
  }

  get buildingInfo () {
    return StaticState.instance.buildingInfoRoot.get(this.props.info.id);
  }

  get buildingEffects () {
    return StaticState.instance.getUpgradeEffects([this.props.info.id]);
  }

  @computed get unlockedEffects () {
    return this.activeProfile.getUpgradeEffects(this.props.info.id);
  }

  get upgrades () {
    const maximumLevel = this.buildingEffects.level;
    return this.upgradeTargets.map((target) =>
      count(maximumLevel).map(() => target)
    );
  }

  async promptPurchaseOf (target: Item | Skill) {
    // Confirm purchase before proceeding
    const proceed = await this.appState.popups.prompt(
      <Prompt query={
        <span>
          Do you wish to pay <GoldText amount={this.unlockedEffects.cost}/> for this upgrade?
        </span>
      }/>
    );

    if (proceed) {
      if (target instanceof Item) {
        this.activeProfile.purchaseItemLevelUp(target);
      } else {
        this.activeProfile.purchaseSkillLevelUp(target);
      }
    }
  }

  render () {
    return (
      <Row>
        <Column>
          <h1 className={css(commonStyles.commonName)}>
            {this.props.hero.classInfo.name}
          </h1>
          <p>{this.upgradeDescription}</p>
        </Column>
        <Column>
          {this.upgrades.map((row, rowIndex) => (
            <Row key={rowIndex}>
              {row.map((target, colIndex) => {
                return (
                  <HeroUpgradeCell
                    key={colIndex}
                    thing={target}
                    level={colIndex + 1}
                    buildingInfo={this.buildingInfo}
                    unlockedEffects={this.unlockedEffects}
                    goldAvailable={this.activeProfile.gold}
                    onPurchase={() => this.promptPurchaseOf(target)}
                  />
                );
              })}
            </Row>
          ))}
        </Column>
      </Row>
    );
  }
}

class HeroUpgradeCell extends React.Component<{
  thing: Item | Skill,
  level: number,
  buildingInfo: BuildingInfo,
  unlockedEffects: BuildingUpgradeEffects,
  goldAvailable: number,
  onPurchase: () => void
}> {
  render () {
    const isAvailable = this.props.level <= this.props.unlockedEffects.level;
    const isUpgraded = this.props.thing.level >= this.props.level;
    const canUpgrade = isAvailable && !isUpgraded;
    const canAfford = this.props.goldAvailable >= this.props.unlockedEffects.cost;
    return (
      <TooltipArea
        classStyle={styles.upgrade}
        side={TooltipSide.Left}
        tip={!isUpgraded && (
          <UpgradeTooltip
            isAvailable={isAvailable}
            cost={<GoldText amount={this.props.unlockedEffects.cost} children={this.props.goldAvailable}/>}
            prerequisiteName={this.props.buildingInfo.name}
            prerequisiteLevel={this.props.level - 1}
          />
        )}>
        <div>
          {this.props.thing instanceof Item ?
            <ItemIcon item={this.props.thing.asLevel(this.props.level)}/> :
            <SkillIcon skill={this.props.thing.asLevel(this.props.level)}/>}
          {canUpgrade && (
            <TooltipArea tip={!canAfford && "Not enough gold"}>
              <button onClick={() => canAfford && this.props.onPurchase()}>Upgrade</button>
            </TooltipArea>
          )}
          {!isAvailable && <div className={css(styles.upgradeOverlay, styles.unavailable)}/>}
          {isUpgraded && <div className={css(styles.upgradeOverlay, styles.upgraded)}/>}
        </div>
      </TooltipArea>
    );
  }
}

const styles = StyleSheet.create({
  upgrade: {
    border: "2px solid gray"
  },

  upgradeOverlay: {
    position: "absolute",
    top: 0, right: 0, bottom: 0, left: 0,
    opacity: 0.5,
    pointerEvents: "none"
  },

  unavailable: {
    background: "red"
  },

  upgraded: {
    background: "green"
  }
});
