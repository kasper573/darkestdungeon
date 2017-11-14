import * as React from "react";
import {Hero, Profile, Item} from "./ProfileState";
import {observer} from "mobx-react";
import {Popup, PopupProps} from "./Popups";
import {computed} from "mobx";
import {css, StyleSheet} from "aphrodite";
import {Column, Row} from "./config/styles";
import {PopupState} from "./PopupState";
import {ItemInfo, ItemType, QuirkInfo, StatsInfo, StatsModSource} from "./StaticState";
import {QuirkText} from "./QuirkText";
import {CommonHeader} from "./CommonHeader";
import {StatsText} from "./StatsText";
import {ItemSlot} from "./ItemSlot";
import {ItemLevel} from "./ItemLevel";
import {PositionDots} from "./PositionDots";
import {SkillIcon} from "./SkillIcon";

@observer
export class HeroOverview extends React.Component<
  PopupProps & {
  popups: PopupState,
  profile: Profile,
  hero: Hero
}> {
  @computed get heroItems () {
    return this.props.profile.items.filter(
      (item: Item) => item.heroId === this.props.hero.id
    );
  }

  render () {
    const {hero, popups, ...rest} = this.props;
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
                <HeroInfoFlag/>
                <HeroModel className={css(styles.model)}/>
              </Column>
              <Column>
                <CommonHeader label="Quirks"/>
                <Row>
                  <Column>
                    <QuirkText popups={popups} quirk={new QuirkInfo("Hard Noggin")}/>
                    <QuirkText popups={popups} quirk={new QuirkInfo("Balanced")}/>
                    <QuirkText popups={popups} quirk={new QuirkInfo("Nymphomania")}/>
                    <QuirkText popups={popups} quirk={new QuirkInfo("Quick Reflexes")}/>
                    <QuirkText popups={popups} quirk={new QuirkInfo("Quickdraw")}/>
                  </Column>
                  <Column style={{textAlign: "right"}}>
                    <QuirkText popups={popups} quirk={new QuirkInfo("Known Cheat", false)}/>
                    <QuirkText popups={popups} quirk={new QuirkInfo("Night Blindness", false)}/>
                    <QuirkText popups={popups} quirk={new QuirkInfo("Thanatophobia", false)}/>
                    <QuirkText popups={popups} quirk={new QuirkInfo("Witness", false)}/>
                  </Column>
                </Row>

                <CommonHeader label="Base Stats"/>
                <Row classStyle={styles.baseStats}>
                  <Column>
                    <StatsText popups={popups} stats={
                      new StatsInfo("HP", "MAX HEALTH POINTS", 23, [
                        {percentages: -0.1, source: StatsModSource.Affliction},
                        {percentages: 0.05, source: StatsModSource.Item},
                        {units: -10, source: StatsModSource.Quirk},
                        {units: 5, source: StatsModSource.Quirk},
                        {units: -1, source: StatsModSource.Item}
                      ])}
                    />
                    <StatsText popups={popups} stats={new StatsInfo("DGE", "DODGE", 10)}/>
                    <StatsText popups={popups} stats={new StatsInfo("PROT", "PROTECTION POINTS", 0)}/>
                    <StatsText popups={popups} stats={new StatsInfo("SPD", "SPEED", 6)}/>
                  </Column>
                  <Column>
                    <StatsText popups={popups} stats={new StatsInfo("ACC", "ACCURACY", 0)}/>
                    <StatsText popups={popups} stats={
                      new StatsInfo("CRIT", "CRITICAL CHANCE", 0.025, [
                        {percentages: -0.1, source: StatsModSource.Affliction},
                        {percentages: 0.15, source: StatsModSource.Item},
                        {units: 0.05, source: StatsModSource.Quirk}
                      ], true)
                    }/>
                    <StatsText popups={popups} stats={
                      new StatsInfo("DMG", "DAMAGE", [3, 7])
                    }/>
                  </Column>
                </Row>

                <CommonHeader label="Equipment"/>
                <Row>
                  <ItemLevel type={ItemType.Armor} level={1}/>
                  <ItemLevel type={ItemType.Weapon} level={1}/>
                  <div style={{flex: 1}}/>
                  <div style={{flex: 1}}/>
                </Row>
                <Row>
                  <ItemSlot popups={popups} item={new ItemInfo("Club", ItemType.Weapon)}/>
                  <ItemSlot popups={popups} item={new ItemInfo("Robe", ItemType.Armor)}/>
                  <ItemSlot popups={popups}/>
                  <ItemSlot popups={popups}/>
                </Row>
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
            <Row>
              <SkillIcon popups={popups} level={1} unlocked/>
              <SkillIcon popups={popups}/>
              <SkillIcon popups={popups} level={1} selected unlocked/>
              <SkillIcon popups={popups} level={1} selected unlocked/>
              <SkillIcon popups={popups}/>
              <SkillIcon popups={popups}/>
              <SkillIcon popups={popups} level={1} selected unlocked/>
            </Row>

            <CommonHeader label="Camping Skills"/>
            <Row>
              <SkillIcon popups={popups} unlocked/>
              <SkillIcon popups={popups}/>
              <SkillIcon popups={popups} selected unlocked/>
              <SkillIcon popups={popups} selected unlocked/>
              <SkillIcon popups={popups}/>
              <SkillIcon popups={popups}/>
              <SkillIcon popups={popups} selected unlocked/>
            </Row>

            <CommonHeader label="Resistances"/>
            <Row classStyle={styles.baseStats}>
              <Column>
                <StatsText popups={popups} stats={
                  new StatsInfo("Stun", "Stun", 0.5, [
                    {percentages: -0.1, source: StatsModSource.Affliction},
                    {percentages: 0.05, source: StatsModSource.Item},
                    {units: -0.1, source: StatsModSource.Quirk},
                    {units: 0.2, source: StatsModSource.Quirk},
                    {units: -0.05, source: StatsModSource.Item}
                  ], true)}
                />
                <StatsText popups={popups} stats={new StatsInfo("Blight", "Blight", 0.5, [], true)}/>
                <StatsText popups={popups} stats={new StatsInfo("Disease", "Disease", 0.5, [], true)}/>
                <StatsText popups={popups} stats={new StatsInfo("Death Blow", "Death Blow", 0.5, [], true)}/>
              </Column>
              <Column>
                <StatsText popups={popups} stats={new StatsInfo("Move", "Move", 0.5, [], true)}/>
                <StatsText popups={popups} stats={new StatsInfo("Bleed", "Bleed", 0.5, [], true)}/>
                <StatsText popups={popups} stats={new StatsInfo("Debuff", "Debuff", 0.5, [], true)}/>
                <StatsText popups={popups} stats={new StatsInfo("Trap", "Trap", 0.5, [], true)}/>
              </Column>
            </Row>

            <CommonHeader label="Diseases"/>
            <QuirkText popups={popups} quirk={new QuirkInfo("Death", false)}/>
          </Column>
        </Row>
      </Popup>
    );
  }
}

const HeroInfoFlag = () => <div>Flag</div>;
const HeroModel = ({className}: any) => <div className={className}>Model</div>;

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
