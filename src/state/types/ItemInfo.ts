import {identifier, serializable} from "serializr";
import {IStatsSource, Stats} from "./Stats";

export enum ItemType {
  Weapon = "W",
  Armor = "A",
  Trinket = "T",
  Usable = "T"
}

export class ItemInfo implements IStatsSource {
  @serializable(identifier()) id: string;

  name: string = "";
  type: ItemType = ItemType.Usable;
  goldCost: number = 0;
  stats: Stats;
  statsSourceName: string = "Item";
}
