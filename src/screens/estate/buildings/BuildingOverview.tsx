import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {Column, commonStyleFn, Row} from "../../../config/styles";
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
        <div className={css(styles.coverup)}/>
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
    width: grid.xSpan(12),
    height: grid.ySpan(13)
  },

  coverup: {
    ...commonStyleFn.dock(),
    background: commonStyleFn.gradient("right", [
      [0, "transparent"],
      [30, "transparent"],
      [45, "black"],
      [100, "black"]
    ]),

    ":after": {
      ...commonStyleFn.dock(),
      content: "' '",
      background: commonStyleFn.gradient("bottom", [
        [0, "black"],
        [20, "black"],
        [30, "transparent"]
      ])
    }
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
