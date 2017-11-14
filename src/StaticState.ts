
import {identifier, serializable} from "serializr";

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

export enum ItemType {
  Weapon = "W",
  Armor = "A",
  Trinket = "T",
  Usable = "T"
}

export enum QuestType {
  Hunt = "Hunt",
  Explore = "Explore",
  Free = "Free"
}

export enum StatsModSource {
  Affliction = "Affliction",
  Item = "Item",
  Quirk = "Quirk"
}

export type StatsValue = number[] | number;

export type StatsMod  = {
  units?: number,
  percentages?: number,
  source: StatsModSource
};

export class QuestInfo {
  private constructor (
    public type: QuestType = QuestType.Free,
    public description: string = ""
  ) {}

  static hunt = new QuestInfo(QuestType.Hunt, "Hunt monsters");
  static explore = new QuestInfo(QuestType.Explore, "Explore rooms");
  static free = new QuestInfo(QuestType.Free, "Free roaming");
}

export class ItemInfo {
  @serializable(identifier()) id: string;
  constructor (
    public name: string = "",
    public type: ItemType = ItemType.Usable,
    public goldCost: number = 0
  ) {}
}

export class CharacterClassInfo {
  @serializable(identifier()) id: string;
  name: string;
  avatarUrl: string = require("../assets/images/hero.png");
}

export class AfflictionInfo {
  @serializable(identifier()) id: string;
  name: string;
}

export class LevelInfo {
  @serializable(identifier()) id: number;
  name: string;
  number: number;
  experience: number;

  get previous () { return StaticState.instance.levels.get(this.id - 1); }
  get next () { return StaticState.instance.levels.get(this.id + 1); }
  get isMax () { return !this.next; }

  get relativeExperience () {
    const from = this.previous ? this.previous.experience : 0;
    return this.experience - from;
  }
}

export class DungeonInfo {
  @serializable(identifier()) id: string;
  name: string;
}

export class StatsInfo {
  constructor (
    public shortName: string,
    public longName: string,
    public value: StatsValue,
    public mods: StatsMod[] = [],
    public isPercentage: boolean = false
  ) {}
}

export class QuirkInfo {
  constructor (
    public name: string,
    public isPositive: boolean = true
  ) {}
}
