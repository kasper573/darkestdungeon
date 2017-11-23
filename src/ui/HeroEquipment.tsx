import * as React from "react";
import {Hero} from "../state/types/Hero";
import {equippableItems, maxEquippedItems} from "../config/general";
import {ItemDropbox} from "./ItemDropbox";

export class HeroEquipment extends React.Component<{hero: Hero}> {
  render () {
    return (
      <ItemDropbox
        slots={maxEquippedItems}
        items={this.props.hero.items}
        filter={(item) => !!equippableItems.get(item.info.type)}
        allowDrop={(droppedItem) => {
          const itemCount = this.props.hero.items.filter(
            (heroItem) => heroItem.info.type === droppedItem.info.type
          ).length;
          return (itemCount + 1) <= equippableItems.get(droppedItem.info.type);
        }}
      />
    );
  }
}
