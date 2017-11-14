import * as React from "react";
import {AppState} from "./AppState";
import {css, StyleSheet} from "aphrodite";
import {EstateRosterEntry} from "./EstateRosterEntry";
import {Hero} from "./ProfileState";
import {observer} from "mobx-react";
import {SortOptions} from "./SortOptions";
import {HeroOverview} from "./HeroOverview";
import {ModalState, PopupAlign} from "./PopupState";

@observer
export class EstateRoster extends React.Component<{
  state: AppState,
  partyFeatures?: boolean
}> {
  showHeroInfo (hero: Hero) {
    this.props.state.popups.show({
      align: PopupAlign.TopLeft,
      position: {x: 0, y: 0},
      modalState: ModalState.Opaque,
      group: "heroInfo",
      content: (
        <HeroOverview
          popups={this.props.state.popups}
          profile={this.props.state.profiles.activeProfile}
          hero={hero}
        />
      )
    });
  }

  render () {
    const profile = this.props.state.profiles.activeProfile;
    const sortedHeroes = profile.heroes.slice().sort(Hero.comparers.rosterIndex);
    return (
      <div className={css(styles.roster)}>
        <div className={css(styles.header)}>
          <span>
            {profile.heroes.length} / {profile.rosterSize}
          </span>
          <SortOptions
            comparers={Hero.visibleComparers}
            onChange={(fn) => profile.sortHeroes(fn)}
          />
        </div>
        <ul>
          {sortedHeroes.map((hero) => (
            <EstateRosterEntry
              key={hero.id}
              partyFeatures={this.props.partyFeatures}
              canJoinParty={!profile.isPartyFull}
              hero={hero}
              popups={this.props.state.popups}
              onSelect={() => this.showHeroInfo(hero)}
            />
          ))}
        </ul>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  roster: {
    position: "absolute",
    top: 0, right: 0
  },

  header: {
    flexDirection: "row",
    alignItems: "center"
  }
});
