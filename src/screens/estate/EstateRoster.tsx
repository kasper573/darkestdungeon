import * as React from "react";
import * as ReactDOM from "react-dom";
import {css, StyleSheet} from "aphrodite";
import {EstateRosterEntry} from "./EstateRosterEntry";
import {observer} from "mobx-react";
import {SortOptions} from "../../ui/SortOptions";
import {AppStateComponent} from "../../AppStateComponent";
import {Hero} from "../../state/types/Hero";
import {Alert} from "../../ui/Popups";

@observer
export class EstateRoster extends AppStateComponent<{
  partyFeatures?: boolean,
  portalNode?: HTMLDivElement
}> {
  receiveHero (droppedHero: Hero, slotHero: Hero) {
    if (droppedHero.inParty) {
      droppedHero.leaveParty();
    }

    const profile = this.appState.profiles.activeProfile;
    if (profile.roster.indexOf(droppedHero) !== -1) {
      // Drag from roster entry to roster entry
      const swapIndex = slotHero.rosterIndex;
      slotHero.rosterIndex = droppedHero.rosterIndex;
      droppedHero.rosterIndex = swapIndex;
    } else if (profile.coach.indexOf(droppedHero) !== -1) {
      // Dragged from stage coach to roster
      if (profile.isRosterFull) {
        this.appState.popups.show(
          <Alert message="The Hero Barracks is full. You can upgrade the barracks at the Stage Coach."/>
        );
      } else {
        profile.recruitHero(droppedHero);
      }
    }
  }

  render () {
    const profile = this.appState.profiles.activeProfile;
    const sortedHeroes = profile.roster.slice().sort(Hero.comparers.rosterIndex);
    const roster = (
      <div className={css(styles.roster)}>
        <div className={css(styles.header)}>
          <span>
            {profile.roster.length} / {profile.rosterSize}
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
              hero={hero}
              onDrop={(droppedHero) => this.receiveHero(droppedHero, hero)}
            />
          ))}
        </ul>
      </div>
    );

    // The roster sometimes needs to be rendered through the portal
    // to avoid being covered by the building modals
    if (this.props.portalNode) {
      return ReactDOM.createPortal(roster, this.appState.portalNode);
    }

    return roster;
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
