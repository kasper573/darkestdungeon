import {observable} from "mobx";
import {identifier, reference, serializable} from "serializr";
import uuid = require("uuid");
import {ItemInfo, StaticState} from "../StaticState";
import {CharacterId} from "./Character";

export type ItemId = string;

export class Item {
  @serializable(identifier()) id: ItemId = uuid();
  @serializable @observable heroId?: CharacterId;
  @serializable @observable level: number = 0;

  @serializable(reference(ItemInfo, StaticState.lookup((i) => i.items)))
  info: ItemInfo;

  static comparers = {
    name (a: Item, b: Item) {
      return a.info.name.localeCompare(b.info.name);
    }
  };

  static fromInfo (info: ItemInfo) {
    const item = new Item();
    item.info = info;
    return item;
  }
}