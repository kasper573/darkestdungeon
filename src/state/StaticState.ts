import {DungeonInfo} from "./types/DungeonInfo";
import {LevelInfo} from "./types/LevelInfo";
import {AfflictionInfo} from "./types/AfflictionInfo";
import {CharacterClassInfo} from "./types/CharacterClassInfo";
import {ItemInfo, ItemType} from "./types/ItemInfo";
import {QuirkId, QuirkInfo} from "./types/QuirkInfo";
import {SkillInfo} from "./types/SkillInfo";
import {DiseaseInfo} from "./types/DiseaseInfo";
import {CharacterTemplate} from "./types/CharacterTemplate";
import {BuildingUpgradeInfo} from "./types/BuildingUpgradeInfo";
import {BuildingInfo} from "./types/BuildingInfo";
import {BuildingUpgradeEffects} from "./types/BuildingUpgradeEffects";

export class StaticState  {
  // noinspection TsLint
  private static _instance: StaticState;
  public static get instance () {
    return StaticState._instance || (StaticState._instance = new StaticState());
  }

  private constructor () {}

  items = new Map<string, ItemInfo>();
  afflictions = new Map<string, AfflictionInfo>();
  levels = new Map<number, LevelInfo>();
  dungeons = new Map<string, DungeonInfo>();
  quirks = new Map<string, QuirkInfo>();
  diseases = new Map<string, DiseaseInfo>();
  skills = new Map<string, SkillInfo>();
  heroes = new Map<string, CharacterTemplate>();
  monsters = new Map<string, CharacterTemplate>();
  classes = new Map<string, CharacterClassInfo>();

  buildingInfoRoot = new BuildingInfo();
  buildingUpgrades = new Map<string, BuildingUpgradeInfo>();
  get buildings () { return this.buildingInfoRoot.children; }

  get heirlooms () {
    return Array.from(this.items.values())
      .filter((info) => info.type === ItemType.Heirloom);
  }

  findQuirkOrDisease (id: QuirkId) {
    return [
      ...StaticState.instance.quirks.values(),
      ...StaticState.instance.diseases.values()
    ].find((q) => q.id === id);
  }

  getUpgradeEffects (
    keys: string[],
    upgrades = Array.from(this.buildingUpgrades.values())
  ): BuildingUpgradeEffects {
    const selectedUpgrades = upgrades.filter((upgrade) => upgrade.isChildOf(keys));
    return selectedUpgrades
      .map((upgrade) => upgrade.effects)
      .reduce(
        (sum, item) => sum.add(item),
        new BuildingUpgradeEffects()
      );
  }

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
