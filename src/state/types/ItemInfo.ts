import {identifier, serializable} from "serializr";
import {Stats} from "./Stats";

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
  type: ItemType = ItemType.Consumable;
  heirloomType?: HeirloomType;
  value: number = 0;
  stats: Stats = new Stats();

  get isStackable () {
    switch (this.type) {
      case ItemType.Consumable:
      case ItemType.Heirloom:
        return true;
    }
    return false;
  }
}
