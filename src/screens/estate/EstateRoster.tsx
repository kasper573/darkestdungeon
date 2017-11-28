import * as React from "react";
import * as ReactDOM from "react-dom";
import {css, StyleSheet} from "aphrodite";
import {EstateRosterEntry, rosterEntryHoverOffset} from "./EstateRosterEntry";
import {observer} from "mobx-react";
import {SortOptions} from "../../ui/SortOptions";
import {AppStateComponent} from "../../AppStateComponent";
import {Hero} from "../../state/types/Hero";
import {grid} from "../../config/Grid";
import {commonStyles} from "../../config/styles";
import {observable} from "mobx";

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
  @observable heroShownInOverview: Hero;

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
          <span className={css(styles.rosterSize, commonStyles.commonName)}>
            {this.activeProfile.roster.length} / {this.activeProfile.rosterSize}
          </span>
          <SortOptions
            comparers={Hero.visibleComparers}
            icons={heroCompareIcons}
            onChange={(fn) => this.activeProfile.sortHeroes(fn)}
          />
        </div>
        <ul>
          {sortedHeroes.map((hero, index) => (
            <EstateRosterEntry
              key={hero.id + "-" + index}
              classStyle={styles.entry}
              index={index}
              hero={hero}
              enableHoverOffset={true}
              lineupFeatures={this.props.lineupFeatures}
              isShownInOverview={this.heroShownInOverview === hero}
              onDrop={(droppedHero) => this.positionHero(droppedHero, hero)}
              onOverviewOpened={() => this.heroShownInOverview = hero}
              onOverviewClosed={() => this.heroShownInOverview = null}
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
    top: grid.paddingTop,
    width: grid.paddingRight + grid.xSpan(3) - rosterEntryHoverOffset,
    right: 0
  },

  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    height: grid.ySpan(1),

    marginBottom: grid.gutter / 2,
    paddingLeft: grid.xSpan(0.3),
    paddingRight: grid.paddingRight,
    paddingBottom: grid.gutter * 1.5 + grid.border,

    backgroundImage: `url(${require("../../../assets/images/stick.png")})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "100% 100%"
  },

  rosterSize: {
    flex: 1
  },

  entry: {

  }
});
