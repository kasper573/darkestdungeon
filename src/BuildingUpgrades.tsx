import * as React from "react";
import {Column, commonStyles, Row} from "./config/styles";
import {BannerHeader} from "./BannerHeader";
import {css, StyleSheet} from "aphrodite";
import {Avatar} from "./Avatar";
import {TooltipArea} from "./TooltipArea";
import {PopupState} from "./PopupState";

export class BuildingUpgrades extends React.Component<{popups: PopupState}> {
  render () {
    return (
      <div>
        <Row>
          <Column>Lorem ipsum dolor sit amet.</Column>
          <Column>
            <BannerHeader>
              <div>Upgraded:</div>
              <div>0%</div>
            </BannerHeader>
          </Column>
        </Row>
        <BuildingUpgrade popups={this.props.popups}/>
        <BuildingUpgrade popups={this.props.popups}/>
        <BuildingUpgrade popups={this.props.popups}/>
      </div>
    );
  }
}

class BuildingUpgrade extends React.Component<{popups: PopupState}> {
  render () {
    const popups = this.props.popups;
    return (
      <div className={css(styles.upgrade)}>
        <h1 className={css(commonStyles.upgradeName)}>Weaponsmithing</h1>
        <Row classStyle={styles.upgradeSequence}>
          <TooltipArea
            tip={"Tip"}
            popups={this.props.popups}
            classStyle={styles.upgradeAvatar}>
            <Avatar src={require("../assets/images/avatar.jpg")}/>
          </TooltipArea>
          <Line/>
          <UpgradeStep popups={popups} upgraded/>
          <Line/>
          <UpgradeStep popups={popups} upgraded/>
          <Line/>
          <UpgradeStep popups={popups} />
          <Line/>
          <UpgradeStep popups={popups} />
          <Line/>
          <UpgradeStep popups={popups} />
          <Line/>
          <UpgradeStep popups={popups} />
        </Row>
      </div>
    );
  }
}

class UpgradeStep extends React.Component<{
  popups: PopupState,
  upgraded?: boolean
}> {
  render () {
    const dynStyle = this.props.upgraded ? styles.stepUpgraded : styles.stepLocked;
    return (
      <div>
        <TooltipArea
          tip={"Tip"}
          popups={this.props.popups}
          classStyle={[styles.step, dynStyle]}
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
    backgroundColor: "gold",
  },

  step: {
    width: stepSize,
    height: stepSize,
    border: "1px solid gray",

    ":hover": {
      boxShadow: "0px 0px 4px white",
    }
  },

  stepUpgraded: {
    backgroundColor: "gold",
    border: "1px solid gold"
  },

  stepLocked: {
    backgroundColor: "gray"
  }
});
