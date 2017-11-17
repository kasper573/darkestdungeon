import {DungeonInfo} from "./types/DungeonInfo";
import {LevelInfo} from "./types/LevelInfo";
import {AfflictionInfo} from "./types/AfflictionInfo";
import {CharacterClassInfo} from "./types/CharacterClassInfo";
import {ItemInfo} from "./types/ItemInfo";

export class StaticState  {
  // noinspection TsLint
  private static _instance: StaticState;
  public static get instance () {
    return StaticState._instance || (StaticState._instance = new StaticState());
  }

  private constructor () {}

  heroNames: string[] = [];
  items = new Map<string, ItemInfo>();
  heroClasses = new Map<string, CharacterClassInfo>();
  afflictions = new Map<string, AfflictionInfo>();
  levels = new Map<number, LevelInfo>();
  dungeons = new Map<string, DungeonInfo>();

  clear () {
    for (const key in this) {
      const prop: any = this[key];
      if (Array.isArray(prop)) {
        this[key] = [];
      } else if (prop instanceof Map) {
        prop.clear();
      }
    }
  }

  // Glue to provide a lookupFn interface for serializr
  public static lookup<K, V> (getLookup: (i: StaticState) => Map<K, V>) {
    return (id: K, resolve: (e: any, r: any) => void) => {
      resolve(null, getLookup(StaticState.instance).get(id));
    };
  }
}
