import {identifier, serializable} from "serializr";
import {Stats} from "./Stats";

export enum ItemType {
  Weapon = "W",
  Armor = "A",
  Trinket = "T",
  Usable = "U",
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
  type: ItemType = ItemType.Usable;
  heirloomType?: HeirloomType;
  value: number = 0;
  stats: Stats = new Stats();
}
