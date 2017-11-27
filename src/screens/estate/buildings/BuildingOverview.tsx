import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {Column, Row} from "../../../config/styles";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {BuildingUpgradeShop} from "./BuildingUpgradeShop";
import {BuildingInfo} from "../../../state/types/BuildingInfo";
import {grid} from "../../../config/Grid";
import {LargeHeader} from "../../../ui/LargeHeader";

@observer
export class BuildingOverview extends React.Component<{
  info: BuildingInfo,
  classStyle?: any
}> {
  @observable areUpgradesVisible = false;

  renderUpgradeSign () {
    return (
      <div
        className={
          css(
            styles.upgradeSign, this.areUpgradesVisible ?
              styles.upgradeSignClose :
              styles.upgradeSignShow
          )
        }
      />
    );
  }

  render () {
    const areUpgradesEnabled = this.props.info.children.size > 0;
    const shouldRenderUpgrades = areUpgradesEnabled && this.areUpgradesVisible;

    return (
      <Row
        classStyle={[styles.container, this.props.classStyle]}
        style={{backgroundImage: `url(${this.props.info.backgroundUrl})`}}>
        <Column>
          <LargeHeader
            icon={this.props.info.avatarUrl}
            iconChildren={areUpgradesEnabled && this.renderUpgradeSign()}
            label={this.props.info.name}
            onClick={areUpgradesEnabled ? () => this.areUpgradesVisible = !this.areUpgradesVisible : undefined}
          />
          {shouldRenderUpgrades && <BuildingUpgradeShop upgrades={this.props.info} />}
        </Column>
        <Column>
          {this.props.children}
        </Column>
      </Row>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundSize: "cover",
    backgroundPosition: "50% 50%",
    width: grid.xSpan(grid.columns * 0.8),
    height: grid.ySpan(grid.rows * 0.8),
    padding: 10
  },

  upgradeSign: {
    width: "25%",
    height: "25%",
    position: "absolute",
    bottom: "-12.5%",
    left: "37.5%"
  },

  upgradeSignClose: {
    backgroundColor: "red"
  },

  upgradeSignShow: {
    backgroundColor: "green"
  }
});
