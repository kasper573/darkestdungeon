import * as React from "react";
import {Item} from "../state/types/Item";
import {ItemType} from "../state/types/ItemInfo";
import {contains} from "../lib/Helpers";
import {ItemLevel} from "./ItemLevel";
import {StatsTextList} from "./StatsText";
import {StatInfo} from "../state/types/StatInfo";

export class ItemBreakdown extends React.Component<{
  item: Item
}> {
  render () {
    const item = this.props.item;
    let stats = item.stats.nonNeutral;
    let cures: StatInfo[] = [];

    if (item.info.type === ItemType.Consumable) {
      const statuses = Array.from(item.stats.statusChances.values())
        .filter((stat) => !stat.isNeutral)
        .map((stat) => stat.info);

      stats = stats.filter((stat) => !contains(statuses, stat.info));
      cures = statuses;
    }

    const showLevel = item.info.type === ItemType.Armor || item.info.type === ItemType.Weapon;

    return (
      <div>
        {showLevel && (
          <ItemLevel type={item.info.type} level={item.level}/>
        )}
        <StatsTextList stats={stats}/>
        {cures.map((info) => (
          <span key={info.id} style={{whiteSpace: "nowrap"}}>Cures {info.shortName}</span>
        ))}
        {item.info.type === ItemType.Heirloom && (
          "Use for building upgrades"
        )}
      </div>
    );
  }
}
