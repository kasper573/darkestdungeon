import * as React from "react";
import {Hero} from "../../../state/types/Hero";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {HeroUpgradeGrid} from "./HeroUpgradeGrid";
import {BuildingInfo} from "../../../state/types/BuildingInfo";
import {EstateRosterEntry} from "../EstateRosterEntry";
import {DragDropSlot} from "../../../lib/DragDropSlot";

export enum HeroUpgradeType {
  Skills,
  Equipment
}

@observer
export class HeroUpgradeShop extends React.Component<{
  type: HeroUpgradeType,
  info: BuildingInfo
}> {
  @observable selectedHero: Hero;

  render () {
    return (
      <div>
        <SlotOrHero hero={this.selectedHero} onChange={(hero) => this.selectedHero = hero}/>
        {this.selectedHero && (
          <HeroUpgradeGrid
            type={this.props.type}
            info={this.props.info}
            hero={this.selectedHero}
          />
        )}
      </div>
    );
  }
}

class SlotOrHero extends React.Component<{
  hero: Hero,
  onChange: (hero?: Hero) => void
}> {
  render () {
    let slotContent: any = "Drag a hero from the roster here";

    if (this.props.hero) {
      slotContent = (
        <EstateRosterEntry
          allowDrop={() => false}
          onDragEnd={() => this.props.onChange(null)}
          hero={this.props.hero}
        />
      );
    }

    return (
      <DragDropSlot
        type={Hero}
        item={this.props.hero}
        allowDrag={() => false}
        allowDrop={(hero: Hero) => !(hero.residentInfo && hero.residentInfo.isLockedIn)}
        onDrop={this.props.onChange}>
        {slotContent}
      </DragDropSlot>
    );
  }
}
