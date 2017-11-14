import * as React from "react";
import {Column, Row} from "./config/styles";
import {HeroOverviewSmall} from "./HeroOverviewSmall";
import {css, StyleSheet} from "aphrodite";
import {Inventory} from "./Inventory";
import {observable} from "mobx";
import {Hero, QuestMap} from "./ProfileState";
import {observer} from "mobx-react";
import {DungeonMap} from "./DungeonMap";

@observer
export class DungeonControlPanel extends React.Component<{
  questMap: QuestMap,
  selectedHero: Hero
}> {
  @observable isMapVisible = false;

  render () {
    const dynamicContent = this.isMapVisible ?
      <DungeonMap map={this.props.questMap}/> :
      <Inventory/>;

    return (
      <div className={css(styles.controlPanel)}>
        <Row>
          <Column classStyle={styles.controlPanelBox}>
            {this.props.selectedHero && (
              <HeroOverviewSmall
                hero={this.props.selectedHero}
              />
            )}
          </Column>
          <Column classStyle={styles.controlPanelBox}>
            <Row style={{flex: 1}}>
              <Column style={{overflow: "hidden"}}>
                {dynamicContent}
              </Column>
              <div style={{borderLeft: "2px solid gray", paddingLeft: 2, width: 50}}>
                <span onClick={() => this.isMapVisible = true}>[MAP]</span>
                <span onClick={() => this.isMapVisible = false}>[INV]</span>
              </div>
            </Row>
          </Column>
        </Row>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  controlPanel: {
    background: "black"
  },

  controlPanelBox: {
    border: "2px solid gray",
    margin: 2,
    padding: 2
  }
});
