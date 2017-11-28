import * as React from "react";
import {observer} from "mobx-react";
import {Popup, PopupProps} from "./Popups";
import {css, StyleSheet} from "aphrodite";
import {Column, commonStyles, Row} from "../config/styles";
import {QuirkText} from "./QuirkText";
import {CommonHeader} from "./CommonHeader";
import {PositionDots} from "./PositionDots";
import {HeroFlag} from "./HeroFlag";
import {CharacterModel} from "./CharacterModel";
import {Hero} from "../state/types/Hero";
import {StatsTextList} from "./StatsText";
import {Skill} from "../state/types/Skill";
import {maxSelectedSkills} from "../config/general";
import {EquipmentDropbox} from "./EquipmentDropbox";
import {SkillIcon} from "./SkillIcon";
import {grid} from "../config/Grid";

@observer
export class HeroOverview extends React.Component<
  PopupProps & {
  hero: Hero,
  enableSkillSelection?: () => boolean,
  onSkillSelected?: (skill: Skill) => void,
  classStyle?: any
}> {
  static defaultProps = {
    enableSkillSelection: () => true
  };

  toggleSkillSelection (skill: Skill) {
    if (skill.level === 0 || !this.props.enableSkillSelection()) {
      return;
    }

    const numSelected = this.props.hero.skills.filter((s) => s.isSelected).length;
    const isSelecting = !skill.isSelected;
    if (isSelecting) {
      if (numSelected < maxSelectedSkills) {
        skill.isSelected = true;
      }
    } else {
      skill.isSelected = false;
    }
  }

  render () {
    const {hero, ...rest} = this.props;
    const onSkillSelected = this.props.onSkillSelected || this.toggleSkillSelection.bind(this);
    return (
      <Popup {...rest}>
        <Row classStyle={[styles.heroOverview, this.props.classStyle]}>
          <Column>
            <Row>
              <button>EDIT</button>
              <input defaultValue={hero.name} size={0} onChange={() => null}/>
            </Row>

            <Row>
              <button>DISMISS</button>
              <span>{hero.classInfo.name}</span>
            </Row>

            <Row>
              <Column classStyle={styles.modelColumn}>
                <HeroFlag hero={hero}/>
                <CharacterModel
                  character={hero}
                  classStyle={styles.model}
                />
              </Column>
              <Column>
                <CommonHeader label="Quirks"/>
                <Row>
                  <Column>
                    {hero.perks.map((q) => <QuirkText key={q.id} quirk={q}/>)}
                  </Column>
                  <Column classStyle={styles.flaws}>
                    {hero.flaws.map((q) => <QuirkText key={q.id} quirk={q}/>)}
                  </Column>
                </Row>

                <CommonHeader label="Base Stats"/>
                <Row classStyle={styles.baseStats}>
                  <StatsTextList stats={hero.stats.base}/>
                </Row>

                <CommonHeader label="Equipment"/>
                <EquipmentDropbox character={hero}/>
              </Column>
            </Row>
          </Column>

          <Column>
            <CommonHeader label="Skills"/>
            <Row>
              <Column classStyle={styles.positionDots}>
                <h1 className={css(commonStyles.nowrap)}>Positions</h1>
                <PositionDots
                  color="gold"
                  innerValues={PositionDots.getPositionValues(hero.selectedSkills)}
                  outerValues={PositionDots.getSupportValues(hero.selectedSkills)}
                />
              </Column>
              <Column classStyle={styles.positionDots}>
                <h1 className={css(commonStyles.nowrap)}>Targets</h1>
                <PositionDots
                  color="red"
                  innerValues={PositionDots.getHostileValues(hero.selectedSkills).reverse()}
                />
              </Column>
            </Row>
            <Row>
              {hero.skills.map((skill) => (
                <SkillIcon
                  key={skill.info.id}
                  skill={skill}
                  onClick={onSkillSelected.bind(this, skill)}
                />
              ))}
            </Row>

            <CommonHeader label="Resistances"/>
            <Row classStyle={styles.baseStats}>
              <StatsTextList stats={Array.from(hero.stats.resistances.values())}/>
            </Row>

            <CommonHeader label="Diseases"/>
            {hero.diseases.map((q) => (
              <QuirkText key={q.id} quirk={q}/>
            ))}
          </Column>
        </Row>
      </Popup>
    );
  }
}

const styles = StyleSheet.create({
  heroOverview: {
    width: grid.xSpan(12),
    height: grid.ySpan(13)

  },

  flaws: {
    textAlign: "right"
  },

  positionDots: {
    alignItems: "center"
  },

  model: {
    position: "absolute",
    bottom: 0
  },

  modelColumn: {
    width: 50,
    flex: "inherit 1"
  },

  baseStats: {
    paddingLeft: "1em",
    paddingRight: "1em"
  }
});
