import * as React from "react";
import {Item} from "../state/types/Item";
import {ItemType} from "../state/types/ItemInfo";
import {ItemLevel} from "./ItemLevel";
import {StatsTextList} from "./StatsText";

export class ItemBreakdown extends React.Component<{
  item: Item
}> {
  render () {
    const item = this.props.item;

    if (item.info.type === ItemType.Consumable && item.info.description) {
      return item.info.description;
    }

    const showLevel = item.info.type === ItemType.Armor || item.info.type === ItemType.Weapon;

    return (
      <div>
        {item.info.description}
        {showLevel && (
          <ItemLevel type={item.info.type} level={item.level}/>
        )}
        <StatsTextList stats={item.stats.nonNeutral}/>
      </div>
    );
  }
}
