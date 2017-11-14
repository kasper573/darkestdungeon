import * as React from "react";
import {Hero} from "./ProfileState";
import {Column, commonStyles, Row} from "./config/styles";
import {Avatar} from "./Avatar";
import {css} from "aphrodite";
import {HeroFlag} from "./HeroFlag";
import {QuirkFaces} from "./QuirkFaces";

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
