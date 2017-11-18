import * as React from "react";
import {observer} from "mobx-react";
import {Popup, PopupProps} from "./Popups";
import {StyleSheet} from "aphrodite";
import {Column, Row} from "../config/styles";
import {QuirkText} from "./QuirkText";
import {CommonHeader} from "./CommonHeader";
import {PositionDots} from "./PositionDots";
import {HeroEquipment} from "./HeroEquipment";
import {HeroSkills} from "./HeroSkills";
import {HeroFlag} from "./HeroFlag";
import {CharacterModel} from "./CharacterModel";
import {Hero} from "../state/types/Hero";
import {StatsTextList} from "./StatsText";
import {SkillInfo} from "../state/types/SkillInfo";

@observer
export class HeroOverview extends React.Component<
  PopupProps & {
  hero: Hero,
  onSkillSelected?: (skill: SkillInfo) => void
}> {
  render () {
    const {hero, ...rest} = this.props;
    return (
      <Popup {...rest}>
        <Row classStyle={styles.heroInfo}>
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
                    {hero.quirks.filter((q) => q.stats.isPositive).map((q) => (
                      <QuirkText key={q.id} quirk={q}/>
                    ))}
                  </Column>
                  <Column style={{textAlign: "right"}}>
                    {hero.quirks.filter((q) => !q.stats.isPositive).map((q) => (
                      <QuirkText key={q.id} quirk={q}/>
                    ))}
                  </Column>
                </Row>

                <CommonHeader label="Base Stats"/>
                <Row classStyle={styles.baseStats}>
                  <StatsTextList stats={hero.stats.base}/>
                </Row>

                <CommonHeader label="Equipment"/>
                <HeroEquipment hero={hero}/>
              </Column>
            </Row>
          </Column>

          <Column>
            <CommonHeader label="Skills"/>
            <Row>
              <Column style={{alignItems: "center"}}>
                <h1 style={{whiteSpace: "nowrap"}}>Positions</h1>
                <PositionDots
                  color="gold"
                  innerValues={PositionDots.getPositionValues(hero.skills)}
                  outerValues={PositionDots.getSupportValues(hero.skills)}
                />
              </Column>
              <Column style={{alignItems: "center"}}>
                <h1 style={{whiteSpace: "nowrap"}}>Targets</h1>
                <PositionDots
                  color="red"
                  innerValues={PositionDots.getHostileValues(hero.skills)}
                />
              </Column>
            </Row>
            <HeroSkills skills={hero.skills} onSkillSelected={this.props.onSkillSelected}/>

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
  heroInfo: {
    minWidth: 450
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
