import * as React from "react";
import {Hero, Profile, Item} from "../state/ProfileState";
import {observer} from "mobx-react";
import {Popup, PopupProps} from "./Popups";
import {computed} from "mobx";
import {StyleSheet} from "aphrodite";
import {Column, Row} from "../config/styles";
import {QuirkInfo, StatsInfo, StatsModSource} from "../state/StaticState";
import {QuirkText} from "./QuirkText";
import {CommonHeader} from "./CommonHeader";
import {StatsText} from "./StatsText";
import {PositionDots} from "./PositionDots";
import {SkillIcon} from "./SkillIcon";
import {HeroEquipment} from "./HeroEquipment";
import {HeroSkills} from "./HeroSkills";
import {HeroFlag} from "./HeroFlag";
import {CharacterModel} from "./CharacterModel";

@observer
export class HeroOverview extends React.Component<
  PopupProps & {
  profile: Profile,
  hero: Hero
}> {
  @computed get heroItems () {
    return this.props.profile.items.filter(
      (item: Item) => item.heroId === this.props.hero.id
    );
  }

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
              <span>Class Name</span>
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
                    <QuirkText quirk={new QuirkInfo("Hard Noggin")}/>
                    <QuirkText quirk={new QuirkInfo("Balanced")}/>
                    <QuirkText quirk={new QuirkInfo("Nymphomania")}/>
                    <QuirkText quirk={new QuirkInfo("Quick Reflexes")}/>
                    <QuirkText quirk={new QuirkInfo("Quickdraw")}/>
                  </Column>
                  <Column style={{textAlign: "right"}}>
                    <QuirkText quirk={new QuirkInfo("Known Cheat", false)}/>
                    <QuirkText quirk={new QuirkInfo("Night Blindness", false)}/>
                    <QuirkText quirk={new QuirkInfo("Thanatophobia", false)}/>
                    <QuirkText quirk={new QuirkInfo("Witness", false)}/>
                  </Column>
                </Row>

                <CommonHeader label="Base Stats"/>
                <Row classStyle={styles.baseStats}>
                  <Column>
                    <StatsText stats={
                      new StatsInfo("HP", "MAX HEALTH POINTS", 23, [
                        {percentages: -0.1, source: StatsModSource.Affliction},
                        {percentages: 0.05, source: StatsModSource.Item},
                        {units: -10, source: StatsModSource.Quirk},
                        {units: 5, source: StatsModSource.Quirk},
                        {units: -1, source: StatsModSource.Item}
                      ])}
                    />
                    <StatsText stats={new StatsInfo("DGE", "DODGE", 10)}/>
                    <StatsText stats={new StatsInfo("PROT", "PROTECTION POINTS", 0)}/>
                    <StatsText stats={new StatsInfo("SPD", "SPEED", 6)}/>
                  </Column>
                  <Column>
                    <StatsText stats={new StatsInfo("ACC", "ACCURACY", 0)}/>
                    <StatsText stats={
                      new StatsInfo("CRIT", "CRITICAL CHANCE", 0.025, [
                        {percentages: -0.1, source: StatsModSource.Affliction},
                        {percentages: 0.15, source: StatsModSource.Item},
                        {units: 0.05, source: StatsModSource.Quirk}
                      ], true)
                    }/>
                    <StatsText stats={
                      new StatsInfo("DMG", "DAMAGE", [3, 7])
                    }/>
                  </Column>
                </Row>

                <CommonHeader label="Equipment"/>
                <HeroEquipment hero={hero}/>
              </Column>
            </Row>
          </Column>

          <Column>
            <CommonHeader label="Combat Skills"/>
            <Row>
              <Column style={{alignItems: "center"}}>
                <h1 style={{whiteSpace: "nowrap"}}>Positions</h1>
                <PositionDots color="gold" innerValues={[1, 3, 2, 0]} outerValues={[0, 1, 0, 1]}/>
              </Column>
              <Column style={{alignItems: "center"}}>
                <h1 style={{whiteSpace: "nowrap"}}>Targets</h1>
                <PositionDots color="red" innerValues={[0, 1, 2, 3]}/>
              </Column>
            </Row>
            <HeroSkills />

            <CommonHeader label="Camping Skills"/>
            <Row>
              <SkillIcon unlocked/>
              <SkillIcon />
              <SkillIcon selected unlocked/>
              <SkillIcon selected unlocked/>
              <SkillIcon />
              <SkillIcon />
              <SkillIcon selected unlocked/>
            </Row>

            <CommonHeader label="Resistances"/>
            <Row classStyle={styles.baseStats}>
              <Column>
                <StatsText stats={
                  new StatsInfo("Stun", "Stun", 0.5, [
                    {percentages: -0.1, source: StatsModSource.Affliction},
                    {percentages: 0.05, source: StatsModSource.Item},
                    {units: -0.1, source: StatsModSource.Quirk},
                    {units: 0.2, source: StatsModSource.Quirk},
                    {units: -0.05, source: StatsModSource.Item}
                  ], true)}
                />
                <StatsText stats={new StatsInfo("Blight", "Blight", 0.5, [], true)}/>
                <StatsText stats={new StatsInfo("Disease", "Disease", 0.5, [], true)}/>
                <StatsText stats={new StatsInfo("Death Blow", "Death Blow", 0.5, [], true)}/>
              </Column>
              <Column>
                <StatsText stats={new StatsInfo("Move", "Move", 0.5, [], true)}/>
                <StatsText stats={new StatsInfo("Bleed", "Bleed", 0.5, [], true)}/>
                <StatsText stats={new StatsInfo("Debuff", "Debuff", 0.5, [], true)}/>
                <StatsText stats={new StatsInfo("Trap", "Trap", 0.5, [], true)}/>
              </Column>
            </Row>

            <CommonHeader label="Diseases"/>
            <QuirkText quirk={new QuirkInfo("Death", false)}/>
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
