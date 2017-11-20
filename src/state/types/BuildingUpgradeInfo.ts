import {BuildingUpgradeEffects} from "./BuildingUpgradeEffects";
import {identifier, serializable} from "serializr";
import {HeirloomType} from "./ItemInfo";

export class BuildingUpgradeInfo {
  @serializable(identifier()) id: string;

  cost = new Map<HeirloomType, number>();
  effects = new BuildingUpgradeEffects();

  get description () {
    const effectStrings = [];
    for (const key in this.effects) {
      const val = (this.effects as any)[key];
      if (val !== 0) {
        const sign = val > 0 ? "+" : "-";
        effectStrings.push(key + " " + sign + Math.abs(val));
      }
    }
    return effectStrings.join(", ");
  }

  isChildOf (keys: string []) {
    return this.id.indexOf(BuildingUpgradeInfo.createId(keys)) === 0;
  }

  static createId (keys: string[]) {
    return keys.filter((key) => key).join(".");
  }
}
