import * as React from "react";
import {Column, commonStyles, Row} from "../../../config/styles";
import {BannerHeader} from "../../../ui/BannerHeader";
import {css, StyleSheet} from "aphrodite";
import {Avatar} from "../../../ui/Avatar";
import {TooltipArea} from "../../../lib/TooltipArea";
import {BuildingUpgradeInfo} from "../../../state/types/BuildingUpgradeInfo";
import {AppStateComponent} from "../../../AppStateComponent";
import {Prompt} from "../../../ui/Popups";
import {observer} from "mobx-react";
import {findSubset} from "../../../lib/ArrayHelpers";
import {BuildingInfo} from "../../../state/types/BuildingInfo";

export class BuildingUpgradeShop extends AppStateComponent<{
  upgrades: BuildingInfo
}> {
  render () {
    const categories: any[] = [];
    this.props.upgrades.children.forEach((category) => {
      categories.push(
        <UpgradeCategory key={category.key} category={category}/>
      );
    });

    const shopUpgrades = this.props.upgrades.getItemsFlattened();
    const ownedUpgrades = findSubset(shopUpgrades, this.activeProfile.buildingUpgrades);
    const unlockProgress = ownedUpgrades.length / shopUpgrades.length;

    return (
      <div>
        <Row>
          <Column>{this.props.upgrades.description}</Column>
          <Column>
            <BannerHeader>
              <div>Upgraded:</div>
              <div>{Math.round(unlockProgress * 100)}%</div>
            </BannerHeader>
          </Column>
        </Row>
        {categories}
      </div>
    );
  }
}

class UpgradeCategory extends React.Component<{
  category: BuildingInfo
}> {
  render () {
    const steps: any[] = [];
    this.props.category.items.forEach((itemInfo, index) => {
      const prerequisite = this.props.category.items[index - 1];
      steps.push(<Line key={"line" + index}/>);
      steps.push(
        <UpgradeItem
          key={itemInfo.id}
          item={itemInfo}
          category={this.props.category}
          level={index + 1}
          prerequisite={prerequisite}/>
      );
    });

    return (
      <div className={css(styles.upgrade)}>
        <h1 className={css(commonStyles.upgradeName)}>{this.props.category.name}</h1>
        <Row classStyle={styles.upgradeSequence}>
          <TooltipArea
            tip={this.props.category.description}
            classStyle={styles.upgradeAvatar}>
            <Avatar src={this.props.category.avatarUrl}/>
          </TooltipArea>
          {steps}
        </Row>
      </div>
    );
  }
}

@observer
class UpgradeItem extends AppStateComponent<{
  item: BuildingUpgradeInfo,
  category: BuildingInfo,
  prerequisite?: BuildingUpgradeInfo,
  level: number
}> {
  async promptUnlock () {
    const proceed = await this.appState.popups.prompt(
      <Prompt query={"Do you wish to purchase this upgrade for " + this.props.item.cost + " gold"}/>
    );

    if (proceed) {
      this.activeProfile.purchaseUpgrade(this.props.item);
    }
  }

  render () {
    const {item} = this.props;

    const isUpgraded = this.activeProfile.ownsUpgrade(item);
    const canAfford = this.activeProfile.gold >= item.cost;
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
            <div>
              <span style={{whiteSpace: "nowrap", color: canAfford ? "green" : "red"}}>
                Cost: {item.cost}
              </span>
              <pre>{item.description}</pre>
              {!isAvailable && (
                <div style={{whiteSpace: "nowrap"}}>
                  <div className={css(commonStyles.commonName)}>Prerequisites:</div>
                  <span style={{color: "red"}}>
                    {this.props.category.name} Level {this.props.level - 1}
                  </span>
                </div>
              )}
            </div>
          )}
        />
      </div>
    );
  }
}

const Line = () => (
  <div className={css(styles.lineContainer)}>
    <div className={css(styles.line)}/>
  </div>
);

const stepSize = 15;
const styles = StyleSheet.create({
  upgrade: {
    marginBottom: 3,
    paddingBottom: 3,
    borderBottom: "2px solid gray"
  },

  upgradeAvatar: {
    height: "100%"
  },

  upgradeSequence: {
    height: stepSize * 1.5,
    alignItems: "center"
  },

  lineContainer: {
    justifyContent: "center"
  },

  line: {
    width: stepSize / 2,
    height: 2,
    backgroundColor: "gold"
  },

  step: {
    width: stepSize,
    height: stepSize,
    border: "1px solid gray",

    ":hover": {
      boxShadow: "0px 0px 4px white"
    }
  },

  stepOwned: {
    backgroundColor: "gold",
    border: "1px solid gold"
  },

  stepAvailable: {
    backgroundColor: "gray"
  },

  stepLocked: {
    backgroundColor: "red"
  }
});
