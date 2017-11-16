import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {EstateRosterEntry} from "./EstateRosterEntry";
import {observer} from "mobx-react";
import {SortOptions} from "../../ui/SortOptions";
import {HeroOverview} from "../../ui/HeroOverview";
import {ModalState, PopupAlign} from "../../state/PopupState";
import {AppStateComponent} from "../../AppStateComponent";
import {Hero} from "../../state/types/Hero";

@observer
export class EstateRoster extends AppStateComponent<{
  partyFeatures?: boolean
}> {
  showHeroInfo (hero: Hero) {
    this.appState.popups.show({
      align: PopupAlign.TopLeft,
      position: {x: 0, y: 0},
      modalState: ModalState.Opaque,
      id: "heroInfo",
      content: (
        <HeroOverview
          profile={this.appState.profiles.activeProfile}
          hero={hero}
        />
      )
    });
  }

  render () {
    const profile = this.appState.profiles.activeProfile;
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
