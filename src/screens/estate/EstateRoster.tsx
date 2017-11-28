import * as React from "react";
import * as ReactDOM from "react-dom";
import {css, StyleSheet} from "aphrodite";
import {EstateRosterEntry} from "./EstateRosterEntry";
import {observer} from "mobx-react";
import {SortOptions} from "../../ui/SortOptions";
import {AppStateComponent} from "../../AppStateComponent";
import {Hero} from "../../state/types/Hero";

const heroCompareIcons = {
  level: require("../../../assets/dd/images/campaign/town/roster/roster_sort_level.png"),
  stress: require("../../../assets/dd/images/campaign/town/roster/roster_sort_stress.png"),
  className: require("../../../assets/dd/images/campaign/town/roster/roster_sort_class.png"),
  activity: require("../../../assets/dd/images/campaign/town/roster/roster_sort_building.png")
};

@observer
export class EstateRoster extends AppStateComponent<{
  lineupFeatures?: boolean,
  portalNode?: HTMLDivElement
}> {
  positionHero (droppedHero: Hero, slotHero: Hero) {
    this.activeProfile.positionHeroInRoster(droppedHero,
      this.activeProfile.roster.indexOf(slotHero)
    );
  }

  render () {
    const sortedHeroes = this.activeProfile.roster.slice().sort(Hero.comparers.rosterIndex);
    const roster = (
      <div className={css(styles.roster)}>
        <div className={css(styles.header)}>
          <span>
            {this.activeProfile.roster.length} / {this.activeProfile.rosterSize}
          </span>
          <SortOptions
            comparers={Hero.visibleComparers}
            icons={heroCompareIcons}
            onChange={(fn) => this.activeProfile.sortHeroes(fn)}
          />
        </div>
        <ul>
          {sortedHeroes.map((hero) => (
            <EstateRosterEntry
              key={hero.id}
              classStyle={styles.entry}
              lineupFeatures={this.props.lineupFeatures}
              hero={hero}
              onDrop={(droppedHero) => this.positionHero(droppedHero, hero)}
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
  },

  entry: {
    marginBottom: 5
  }
});
