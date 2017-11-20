import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {Column, Row} from "../../../config/styles";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {BuildingUpgradeShop} from "./BuildingUpgradeShop";
import {Avatar} from "../../../ui/Avatar";
import {BuildingInfo} from "../../../state/types/BuildingInfo";

@observer
export class BuildingOverview extends React.Component<{
  info: BuildingInfo,
  classStyle?: any
}> {
  @observable areUpgradesVisible = false;

  render () {
    const upgradeSign = this.props.info.children.size > 0 && (
      <div
        onClick={() => this.areUpgradesVisible = !this.areUpgradesVisible}
        className={
          css(
            styles.upgradeSign, this.areUpgradesVisible ?
              styles.upgradeSignClose :
              styles.upgradeSignShow
          )
        }
      />
    );

    return (
      <Row
        classStyle={[styles.container, this.props.classStyle]}
        style={{backgroundImage: `url(${this.props.info.backgroundUrl})`}}>
        <Column>
          <Row>
            <Avatar
              classStyle={styles.headerAvatar}
              src={this.props.info.avatarUrl}>
              {upgradeSign}
            </Avatar>
            <h1 className={css(styles.headerLabel)}>
              {this.props.info.name}
            </h1>
          </Row>
          {this.areUpgradesVisible && <BuildingUpgradeShop upgrades={this.props.info} />}
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
    minWidth: 350,
    minHeight: 200,
    padding: 10
  },

  headerAvatar: {
    opacity: 0.5,
    ":hover": {
      opacity: 1
    }
  },

  headerLabel: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderTop: "2px solid gray",
    borderBottom: "2px solid gray"
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
