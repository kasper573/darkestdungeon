import * as React from "react";
import {Column, commonStyles, Row} from "../../config/styles";
import {Avatar} from "../../ui/Avatar";
import {css} from "aphrodite";
import {HeroFlag} from "../../ui/HeroFlag";
import {QuirkFaces} from "../../ui/QuirkFaces";
import {Hero} from "../../state/types/Hero";
import {Quest} from "../../state/types/Quest";

export class DungeonResultHeroes extends React.Component<{
  quest: Quest
}> {
  render () {
    const heroes = [
      ...this.props.quest.party,
      ...this.props.quest.deceased
    ];

    return (
      <div>
        {heroes.map((hero) => (
          <HeroResult key={hero.id} hero={hero}/>
        ))}
      </div>
    );
  }
}

class HeroResult extends React.Component<{
  hero: Hero
}> {
  render () {
    return (
      <Row>
        <Column>
          <div className={css(commonStyles.heroName)}>
            {this.props.hero.name}
            </div>
          <Row>
            <Avatar src={this.props.hero.classInfo.avatarUrl}/>
            <QuirkFaces/>
          </Row>
        </Column>
        {this.props.hero.isAlive ? <HeroFlag hero={this.props.hero} /> : "Dead"}
      </Row>
    );
  }
}
