import * as React from "react";
import {observer} from "mobx-react";
import {AppStateComponent} from "../../../AppStateComponent";
import {BuildingUpgradeInfo} from "../../../state/types/BuildingUpgradeInfo";
import {BuildingInfo} from "../../../state/types/BuildingInfo";
import {Prompt} from "../../../ui/Popups";
import {Heirlooms} from "../../../ui/Heirlooms";
import {TooltipArea} from "../../../lib/TooltipArea";
import {UpgradeTooltip} from "./UpgradeTooltip";
import {StyleSheet} from "aphrodite";
import {commonColors, commonStyleFn} from "../../../config/styles";

@observer
export class BuildingUpgradeIcon extends AppStateComponent<{
  item: BuildingUpgradeInfo,
  category: BuildingInfo,
  prerequisite?: BuildingUpgradeInfo,
  level: number
}> {
  async promptUnlock () {
    const proceed = await this.appState.popups.prompt(
      <Prompt query={(
        <div>
          Do you wish to purchase this upgrade for <Heirlooms counts={this.props.item.cost}/>?
        </div>
      )}/>
    );

    if (proceed) {
      this.activeProfile.purchaseUpgrade(this.props.item);
    }
  }

  render () {
    const {item} = this.props;

    const isUpgraded = this.activeProfile.ownsUpgrade(item);
    const canAfford = this.activeProfile.hasEnoughHeirlooms(item.cost);
    const isAvailable = !this.props.prerequisite || this.activeProfile.ownsUpgrade(this.props.prerequisite);
    const canBuy = canAfford && isAvailable && !isUpgraded;

    const dynStyle = isUpgraded ? styles.stepOwned : (isAvailable ? styles.stepAvailable : styles.stepLocked);
    const onClick = canBuy ? () => this.promptUnlock() : undefined;

    return (
      <div>
        <TooltipArea
          onClick={onClick}
          classStyle={[styles.step, dynStyle]}
          tip={(
            <UpgradeTooltip
              cost={<Heirlooms counts={item.cost} compare={this.activeProfile.heirloomCounts}/>}
              isAvailable={isAvailable}
              prerequisiteName={this.props.category.name}
              prerequisiteLevel={this.props.level - 1}
            >
              <pre>{item.description}</pre>
            </UpgradeTooltip>
          )}
        />
      </div>
    );
  }
}

export const stepSize = 15;
const styles = StyleSheet.create({
  step: {
    width: stepSize,
    height: stepSize,
    border: commonStyleFn.outline("black"),

    ":hover": {
      boxShadow: "0px 0px 4px white"
    }
  },

  stepOwned: {
    backgroundColor: "gold",
    border: commonStyleFn.outline(commonColors.gold)
  },

  stepAvailable: {
    backgroundColor: "gray"
  },

  stepLocked: {
    backgroundColor: "red"
  }
});
