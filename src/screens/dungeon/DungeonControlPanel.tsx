import * as React from "react";
import {Column, Row} from "../../config/styles";
import {DungeonHeroSummary} from "./DungeonHeroSummary";
import {css, StyleSheet} from "aphrodite";
import {Inventory} from "../../ui/Inventory";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {DungeonMap} from "./DungeonMap";
import {Hero} from "../../state/types/Hero";
import {ItemType} from "../../state/types/ItemInfo";
import {Profile} from "../../state/types/Profile";
import {Quest} from "../../state/types/Quest";

@observer
export class DungeonControlPanel extends React.Component<{
  quest: Quest,
  profile: Profile,
  selectedHero: Hero
}> {
  @observable isMapVisible = false;

  renderSideContent () {
    if (this.isMapVisible) {
      return <DungeonMap quest={this.props.quest}/>;
    }

    return (
      <Inventory
        heroes={this.props.profile.party}
        items={this.props.quest.items}
        onItemRightClick={(item) => {
          if (item.info.type === ItemType.Consumable) {
            this.props.quest.useItem(item, this.props.selectedHero);
          }
        }}/>
    );
  }

  render () {
    return (
      <div className={css(styles.controlPanel)}>
        <Row>
          <Column classStyle={styles.controlPanelBox}>
            {this.props.selectedHero && (
              <DungeonHeroSummary
                hero={this.props.selectedHero}
              />
            )}
          </Column>
          <Column classStyle={styles.controlPanelBox}>
            <Row style={{flex: 1}}>
              <Column>
                {this.renderSideContent()}
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
    background: "black",
    maxHeight: "50%"
  },

  controlPanelBox: {
    border: "2px solid gray",
    margin: 2,
    padding: 2
  }
});
