import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {Column, Row} from "./config/styles";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {BuildingUpgrades} from "./BuildingUpgrades";
import {Avatar} from "./Avatar";
import {PopupState} from "./PopupState";

@observer
export class BuildingOverview extends React.Component<{
  popups: PopupState,
  header: string,
  backgroundUrl: string,
  classStyle?: any
}> {
  @observable areUpgradesVisible = false;
  @observable areUpgradesAvailable = true;

  render () {
    const upgradeSign = this.areUpgradesAvailable && (
      <div className={
        css(
          styles.upgradeSign, this.areUpgradesVisible ?
            styles.upgradeSignClose :
            styles.upgradeSignShow
        )
      }/>
    );

    return (
      <Row
        classStyle={[styles.container, this.props.classStyle]}
        style={{backgroundImage: `url(${this.props.backgroundUrl})`}}>
        <Column>
          <Row>
            <Avatar
              classStyle={styles.headerAvatar}
              src={require("../assets/images/avatar.jpg")}
              onClick={() => this.areUpgradesVisible = !this.areUpgradesVisible}>
              {upgradeSign}
            </Avatar>
            <h1 className={css(styles.headerLabel)}>
              {this.props.header}
            </h1>
          </Row>
          {this.areUpgradesVisible && <BuildingUpgrades popups={this.props.popups}/>}
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
