import * as React from "react";
import {Column, Row} from "../../../config/styles";
import {BannerHeader} from "../../../ui/BannerHeader";
import {AppStateComponent} from "../../../AppStateComponent";
import {findSubset} from "../../../lib/Helpers";
import {BuildingInfo} from "../../../state/types/BuildingInfo";
import {BuildingUpgradeCategory} from "./BuildingUpgradeCategory";

export class BuildingUpgradeShop extends AppStateComponent<{
  upgrades: BuildingInfo
}> {
  render () {
    const categories: any[] = [];
    this.props.upgrades.children.forEach((category) => {
      categories.push(
        <BuildingUpgradeCategory key={category.key} category={category}/>
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
