import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {Column, commonStyleFn, Row} from "../../../config/styles";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {BuildingUpgradeShop} from "./BuildingUpgradeShop";
import {BuildingInfo} from "../../../state/types/BuildingInfo";
import {grid} from "../../../config/Grid";
import {LargeHeader} from "../../../ui/LargeHeader";
import {Icon} from "../../../ui/Icon";

const moreInfoIconUrl = require("../../../../assets/dd/images/shared/progression/more_info_icon.png");
const lessInfoIconUrl = require("../../../../assets/dd/images/shared/progression/less_info_icon.png");

@observer
export class BuildingOverview extends React.Component<{
  info: BuildingInfo,
  classStyle?: any
}> {
  @observable areUpgradesVisible = false;

  render () {
    const areUpgradesEnabled = this.props.info.children.size > 0;
    const shouldRenderUpgrades = areUpgradesEnabled && this.areUpgradesVisible;
    const upgradeIconUrl = this.areUpgradesVisible ? lessInfoIconUrl : moreInfoIconUrl;

    return (
      <Row
        classStyle={[styles.container, this.props.classStyle]}
        style={{backgroundImage: `url(${this.props.info.backgroundUrl})`}}>
        <div className={css(styles.coverup)}/>
        <Column>
          {this.props.info.npcImageUrl && (
            <div
              className={css(styles.npc)}
              style={{backgroundImage: `url(${this.props.info.npcImageUrl})`}}
            />
          )}
          <LargeHeader
            label={this.props.info.name}
            icon={this.props.info.avatarUrl}
            iconChildren={areUpgradesEnabled && (<Icon src={upgradeIconUrl} iconStyle={styles.upgradeIcon}/>)}
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

  npc: {
    ...commonStyleFn.dock(),
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "50% 100%",
    marginRight: -grid.xSpan(1),
    flex: 1
  },

  upgradeIcon: {
    width: grid.ySpan(1),
    height: grid.ySpan(1)
  },

  upgradeSignClose: {
    backgroundColor: "red"
  },

  upgradeSignShow: {
    backgroundColor: "green"
  }
});
