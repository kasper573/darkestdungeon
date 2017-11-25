import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {CharacterModel} from "../../ui/CharacterModel";
import {Row} from "../../config/styles";
import {CurioModel} from "../../ui/CurioModel";
import {Hero} from "../../state/types/Hero";
import {observer} from "mobx-react";
import {Quest} from "../../state/types/Quest";
import {SkillTargetObject} from "../../state/types/SkillInfo";

@observer
export class DungeonScene extends React.Component<{
  quest: Quest,
  onHeroOverviewRequested: (hero: Hero) => void
}> {
  render () {
    const quest = this.props.quest;
    return (
      <Row classStyle={styles.scene}>
        <Row classStyle={styles.party}>
          {quest.party.map((member, positionIndex) => {
            let canActOn: boolean;
            if (quest.selectedSkill) {
              const targetInfo = quest.selectedSkill.info.target;
              canActOn = quest.canHeroAct &&
                targetInfo.object === SkillTargetObject.Ally &&
                targetInfo.isMatch(positionIndex);
            }

            const onClick = quest.inBattle ?
              () => canActOn && quest.performTurnAction(quest.selectedSkill, [member]) :
              () => quest.selectHero(member);

            const highlight = quest.inBattle ?
              member === quest.turnActor :
              member === quest.selectedHero;

            return (
              <CharacterModel
                key={member.id}
                character={member}
                target={canActOn}
                highlight={highlight}
                onClick={onClick}
                onRightClick={this.props.onHeroOverviewRequested.bind(this, member)}>
                <div className={css(styles.actorIndex)}>
                  {quest.getActorIndex(member)}
                </div>
              </CharacterModel>
            );
          })}
        </Row>

        <CurioModel />

        {quest.inBattle && (
          <Row classStyle={styles.monsters}>
            {quest.enemies.map((enemy, positionIndex) => {
              let canActOn: boolean;
              if (quest.selectedSkill) {
                const targetInfo = quest.selectedSkill.info.target;
                canActOn = quest.canHeroAct &&
                  targetInfo.object === SkillTargetObject.Enemy &&
                  targetInfo.isMatch(positionIndex);
              }

              const highlight = quest.inBattle ?
                enemy === quest.turnActor :
                enemy === quest.selectedHero;

              return (
                <CharacterModel
                  key={enemy.id}
                  character={enemy}
                  highlight={highlight}
                  target={canActOn}
                  onMouseEnter={() => quest.selectEnemy(enemy)}
                  onMouseLeave={() => quest.selectEnemy(null)}
                  onClick={() => canActOn && quest.performTurnAction(quest.selectedSkill, [enemy])}>
                  <div className={css(styles.actorIndex)}>
                    {quest.getActorIndex(enemy)}
                  </div>
                </CharacterModel>
              );
            })}
          </Row>
        )}
      </Row>
    );
  }
}

const styles = StyleSheet.create({
  scene: {

  },

  party: {

  },

  monsters: {

  },

  actorIndex: {

  }
});
