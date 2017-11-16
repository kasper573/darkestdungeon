import * as React from "react";
import {Column, commonStyles, Row} from "../../config/styles";
import {Avatar} from "../../ui/Avatar";
import {css} from "aphrodite";
import {HeroFlag} from "../../ui/HeroFlag";
import {QuirkFaces} from "../../ui/QuirkFaces";
import {Hero} from "../../state/types/Hero";

export class DungeonResultHeroes extends React.Component<{
  party: Hero[]
}> {
  render () {
    return (
      <div>
        {this.props.party.map((hero) => (
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
        <HeroFlag hero={this.props.hero} />
      </Row>
    );
  }
}
