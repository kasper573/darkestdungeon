import {DungeonInfo} from "./static/DungeonInfo";
import {LevelInfo} from "./static/LevelInfo";
import {AfflictionInfo} from "./static/AfflictionInfo";
import {CharacterClassInfo} from "./static/CharacterClassInfo";
import {ItemInfo} from "./static/ItemInfo";

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

  // Glue to provide a lookupFn interface for serializr
  public static lookup<K, V> (getLookup: (i: StaticState) => Map<K, V>) {
    return (id: K, resolve: (e: any, r: any) => void) => {
      resolve(null, getLookup(StaticState.instance).get(id));
    };
  }
}

export enum QuestType {
  Hunt = "Hunt",
  Explore = "Explore",
  Free = "Free"
}

export class QuestInfo {
  private constructor (
    public type: QuestType = QuestType.Free,
    public description: string = ""
  ) {}

  static hunt = new QuestInfo(QuestType.Hunt, "Hunt monsters");
  static explore = new QuestInfo(QuestType.Explore, "Explore rooms");
  static free = new QuestInfo(QuestType.Free, "Free roaming");
}
