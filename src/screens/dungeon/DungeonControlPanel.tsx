import * as React from "react";
import {Column, Row} from "../../config/styles";
import {DungeonCharacterSummary} from "./DungeonCharacterSummary";
import {css, StyleSheet} from "aphrodite";
import {Inventory} from "../../ui/Inventory";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {DungeonMap} from "./DungeonMap";
import {ItemType} from "../../state/types/ItemInfo";
import {Quest} from "../../state/types/Quest";

@observer
export class DungeonControlPanel extends React.Component<{
  quest: Quest
}> {
  @observable isMapVisible = false;

  renderSideContent () {
    if (this.props.quest.selectedEnemy) {
      return <DungeonCharacterSummary character={this.props.quest.selectedEnemy}/>;
    }

    if (this.isMapVisible) {
      return <DungeonMap quest={this.props.quest}/>;
    }

    return (
      <Inventory
        heroes={this.props.quest.party}
        items={this.props.quest.items}
        isEnabled={!this.props.quest.inBattle || this.props.quest.canHeroAct}
        onItemRightClick={(item) => {
          if (item.info.type === ItemType.Consumable) {
            this.props.quest.useItem(item, this.props.quest.selectedHero);
          }
        }}
      />
    );
  }

  render () {
    const {quest} = this.props;
    return (
      <div className={css(styles.controlPanel)}>
        <Row>
          <Column classStyle={styles.controlPanelBox}>
            {quest.selectedHero && (
              <DungeonCharacterSummary
                character={quest.selectedHero}
                enableSkills={quest.inBattle && quest.canHeroAct}
                selectedSkill={quest.selectedSkill}
                onSkillClicked={(skill) => {
                  if (skill) {
                    quest.selectSkill(skill);
                  } else {
                    quest.passTurnAction();
                  }
                }}
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
