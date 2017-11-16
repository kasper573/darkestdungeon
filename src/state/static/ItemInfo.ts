import {identifier, serializable} from "serializr";

export enum ItemType {
  Weapon = "W",
  Armor = "A",
  Trinket = "T",
  Usable = "T"
}

export class ItemInfo {
  @serializable(identifier()) id: string;

  constructor (
    public name: string = "",
    public type: ItemType = ItemType.Usable,
    public goldCost: number = 0
  ) {}
}
