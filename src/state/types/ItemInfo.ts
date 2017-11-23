import {identifier, serializable} from "serializr";
import {Stats, TurnStats} from "./Stats";
import {Quest} from "./Quest";

export enum ItemType {
  Weapon = "W",
  Armor = "A",
  Trinket = "T",
  Consumable = "C",
  Heirloom = "H"
}

export enum HeirloomType {
  Bust,
  Portrait,
  Deed,
  Crest
}

export class ItemInfo {
  @serializable(identifier()) id: string;

  name: string = "[single name]";
  pluralName: string = "[plural name]";
  description: string = "";
  type: ItemType = ItemType.Consumable;
  heirloomType?: HeirloomType;
  value: number = 0;
  stats: Stats = new Stats();
  resetHunger: boolean;
  removeBuffs: boolean;
  offsetLight: number = 0;
  buff?: TurnStats;
  getStoreCount?: (q: Quest) => number;

  get isStackable () {
    switch (this.type) {
      case ItemType.Consumable:
      case ItemType.Heirloom:
        return true;
    }
    return false;
  }
}
