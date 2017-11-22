import {SkillId, SkillInfo} from "./SkillInfo";
import {computed} from "mobx";
import {Stats, TurnStats} from "./Stats";
import {StaticState} from "../StaticState";

export class Skill {
  @computed get level () {
    return this.levels.get(this.info.id) || 0;
  }

  set level (value: number) {
    this.levels.set(this.info.id, value);
  }

  @computed get isSelected () {
    return this.selections.get(this.info.id);
  }

  set isSelected (value: boolean) {
    this.selections.set(this.info.id, value);
  }

  get statsScale () {
    const maxSkillLevel = StaticState.instance.getUpgradeEffects(["guild"]).level;
    return 1 + ((this.level - 1) / maxSkillLevel);
  }

  get stats () {
    const scaledStats = new Stats();
    scaledStats.add(this.info.stats);
    scaledStats.scale(this.statsScale);
    return scaledStats;
  }

  get damageScale () {
    return this.info.damageScale * this.statsScale;
  }

  get buff () {
    if (!this.info.buff) {
      return;
    }

    const scaledBuff = new TurnStats();
    scaledBuff.turns = this.info.buff.turns;
    scaledBuff.add(this.info.buff);
    scaledBuff.scale(this.statsScale);
    return scaledBuff;
  }

  constructor (
    private levels: Map<SkillId, number>,
    private selections: Map<SkillId, boolean>,
    public info: SkillInfo
  ) {}

  asLevel (level: number) {
    const fakeLevelStorage = new Map<SkillId, number>();
    const fakeSelectionStorage = new Map<SkillId, boolean>();
    const item = new Skill(fakeLevelStorage, fakeSelectionStorage, this.info);
    item.level = level;
    return item;
  }
}
