import {Experienced} from "./Experienced";
import {identifier, reference, serializable} from "serializr";
import uuid = require("uuid");
import {DungeonInfo, StaticState} from "../StaticState";

export type DungeonId = string;

export class Dungeon extends Experienced {
  @serializable(identifier()) id: DungeonId = uuid();

  @serializable(reference(DungeonInfo, StaticState.lookup((i) => i.dungeons)))
  info: DungeonInfo;

  static fromInfo (info: DungeonInfo) {
    const dungeon = new Dungeon();
    dungeon.info = info;
    return dungeon;
  }
}
