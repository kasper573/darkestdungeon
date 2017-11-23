import {computed, observable} from "mobx";
import {StaticState} from "../StaticState";
import {identifier, list, map, object, primitive, reference, serializable} from "serializr";
import {Experienced} from "./Experienced";
import {AfflictionInfo} from "./AfflictionInfo";
import {CharacterClassInfo} from "./CharacterClassInfo";
import {Item} from "./Item";
import {QuirkInfo} from "./QuirkInfo";
import {CharacterStatus} from "./CharacterStatus";
import {SkillId, SkillTargetObject} from "./SkillInfo";
import {DiseaseInfo} from "./DiseaseInfo";
import {Stats, TurnStats} from "./Stats";
import {cap, contains} from "../../lib/Helpers";
import uuid = require("uuid");
import {BuildingInfoId} from "./BuildingInfo";
import {Skill} from "./Skill";
import {ItemType} from "./ItemInfo";

export type CharacterId = string;

export class Character extends Experienced {
  @serializable(identifier()) id: CharacterId = uuid();

  @serializable @observable name: string;

  @serializable(reference(CharacterClassInfo, StaticState.lookup((i) => i.classes)))
  classInfo: CharacterClassInfo;

  @serializable(reference(AfflictionInfo, StaticState.lookup((i) => i.afflictions)))
  affliction: AfflictionInfo;

  @serializable(list(reference(QuirkInfo, StaticState.lookup((i) => i.quirks))))
  quirks: QuirkInfo[] = [];

  @serializable(list(reference(DiseaseInfo, StaticState.lookup((i) => i.diseases))))
  diseases: DiseaseInfo[] = [];

  @serializable(list(object(Item)))
  @observable
  items: Item[] = [];

  @serializable @observable hunger: number = 0;

  @serializable @observable buffSourceName: string;

  @serializable(object(TurnStats))
  @observable
  buff: TurnStats;

  @serializable(map(object(TurnStats)))
  @observable
  dots = new Map<CharacterStatus, TurnStats>();

  @serializable(object(Stats))
  @observable mutableStats = new Stats();

  @serializable(map(primitive()))
  @observable
  private skillLevels = new Map<SkillId, number>();

  @serializable(map(primitive()))
  @observable
  private skillSelections = new Map<SkillId, boolean>();

  get skills () {
    return this.classInfo.skills.map((info) => new Skill(this.skillLevels, this.skillSelections, info));
  }

  @computed get armor () {
    return this.items.find((i) => i.info.type === ItemType.Armor);
  }

  @computed get weapon () {
    return this.items.find((i) => i.info.type === ItemType.Weapon);
  }

  get stats () {
    const sum = new Stats();
    sum.add(this.classInfo);
    sum.add(this.mutableStats);

    if (this.buff) {
      sum.add(this.buff, {
        stats: new Stats(),
        name: this.buffSourceName,
        statsSourceName: this.buff.isPositive ? "Buff" : "Debuff"
      });
    }

    if (this.affliction) {
      sum.add(this.affliction);
    }

    this.quirks
      .forEach((source) => sum.add(source));

    this.diseases
      .forEach((source) => sum.add(source));

    this.items
      .forEach((source) => sum.add(source));

    return sum;
  }

  acceptsTreatmentFrom (treatmentId: BuildingInfoId) {
    for (const quirk of [...this.quirks, ...this.diseases]) {
      if (quirk.forcedTreatmentIds.length > 0 &&
        !contains(quirk.forcedTreatmentIds, treatmentId)) {
        return false;
      }
      if (contains(quirk.bannedTreatmentIds, treatmentId)) {
        return false;
      }
    }
    return true;
  }

  offsetStats (offset: Stats) {
    const updatedStats = new Stats();
    updatedStats.add(this.mutableStats);
    updatedStats.add(offset);
    this.mutableStats = updatedStats;
  }

  resetMutableStats () {
    const reset = new Stats();
    reset.health.value = this.stats.maxHealth.value;
    reset.stress.value = 100; //cap(reset.stress.value, 0, this.stats.maxStress.value / 2);
    this.mutableStats = reset;
    this.dots.clear();
    this.removeBuffs();
  }

  processTurn () {
    if (this.buff) {
      this.buff.turns--;
      if (this.buff.turns <= 0) {
        this.removeBuffs();
      }
    }

    const memento = new Stats();

    this.dots.forEach((stats, status) => {
      const delta = this.applyStats(true, stats);

      // Add damage memento
      memento.add(delta);

      // Add status memento
      memento.statusChances.get(status).value = 1;

      stats.turns--;
      if (stats.turns <= 0) {
        this.dots.delete(status);
      }
    });

    return memento;
  }

  applyStats (isCrit: boolean, actionStats: Stats) {
    const targetStats = this.stats;

    // Calculate stats changes in the target
    const deltaStats = new Stats();

    // Reduce health by damage, ignoring protect for critical hits
    deltaStats.health.value += Math.min(
      0, (isCrit ? 0 : 1) * targetStats.protect.value - actionStats.damage.value
    );

    // Apply flat stress/health changes (ie. heals), double value for crits
    deltaStats.health.value += (isCrit ? 2 : 1) * actionStats.health.value;
    deltaStats.stress.value += (isCrit ? 2 : 1) * actionStats.stress.value;

    // Cap stress and health changes
    const minStressDelta = -targetStats.stress.value;
    const maxStressDelta = targetStats.maxStress.value - targetStats.stress.value;
    deltaStats.stress.value = cap(deltaStats.stress.value, minStressDelta, maxStressDelta);

    const minHealthDelta = -targetStats.health.value;
    const maxHealthDelta = targetStats.maxHealth.value - targetStats.health.value;
    deltaStats.health.value = cap(deltaStats.health.value, minHealthDelta, maxHealthDelta);

    deltaStats.round();

    this.offsetStats(deltaStats);

    return deltaStats;
  }

  applyBuff (buff: TurnStats, sourceName: string) {
    // TODO support multiple buffs
    const buffClone = new TurnStats();
    buffClone.turns = buff.turns;
    buffClone.add(buff);
    this.buffSourceName = sourceName;
    this.buff = buffClone;
  }

  removeBuffs () {
    this.buff = null;
    this.buffSourceName = null;
  }

  useSkill (skill: Skill, target: Character) {
    const targetStats = target.stats;

    // Turn character and skill stats into action stats
    const actionStats = new Stats();
    actionStats.add(this.stats.battle);
    actionStats.add(skill.stats);

    // Make accuracy and damage numbers slightly random
    const strength = 0.8 + Math.random () * 0.2;
    const precision = 0.8 + Math.random () * 0.2;
    actionStats.damage.value *= skill.damageScale * strength;
    actionStats.accuracy.value *= precision;
    actionStats.health.value *= strength;
    actionStats.stress.value *= strength;

    const isAllyTarget = skill.info.target.object === SkillTargetObject.Ally;
    const isCrit = Math.random() <= actionStats.criticalChance.value;
    const willBasicHit = actionStats.accuracy.value > targetStats.dodge.value;
    const willBuffHit = Math.random() <= Character.getStatusHitChance(
      CharacterStatus.Buff, actionStats, targetStats
    );

    const willHit = isAllyTarget || willBasicHit;
    const memento = willHit ? target.applyStats(isCrit, actionStats) : new Stats();

    // Add crit memento
    if (isCrit) {
      memento.criticalChance.value = 1;
    }

    // Apply buff for this skill
    if (skill.buff && (isAllyTarget || willBuffHit)) {
      this.applyBuff(skill.buff, skill.info.name);

      // Add buff memento
      memento.statusChances.get(CharacterStatus.Buff).value = 1;
    }

    // Apply status effects for this skill
    skill.stats.statusChances.forEach((s, status) => {
      const willStatusHit = Math.random() <= Character.getStatusHitChance(status, actionStats, targetStats);
      if (!willStatusHit) {
        return;
      }

      // Some statuses apply damage over time
      const damageScale = actionStats.statusDamageScales.get(status).value;
      if (damageScale) {
        const turnStats = new TurnStats();
        turnStats.damage.value = actionStats.damage.value * damageScale;
        turnStats.round();

        if (turnStats.damage.value) {
          target.dots.set(status, turnStats);
        } else {
          return; // Skip memento since damage is irrelevant
        }
      }

      // Add status memento
      memento.statusChances.get(status).value = 1;
    });

    return memento;
  }

  applyItem (item: Item) {
    this.applyStats(false, item.stats);
    item.stats.statusChances.forEach((value, status) => {
      this.dots.delete(status);
    });

    if (item.info.removeBuffs) {
      this.removeBuffs();
    }

    if (item.info.buff) {
      this.applyBuff(item.info.buff, item.name);
    }

    if (item.info.resetHunger) {
      this.hunger = 0;
    }
  }

  static getStatusHitChance (status: CharacterStatus, actionStats: Stats, targetStats: Stats) {
    const chance = actionStats.statusChances.get(status).value;
    const resistance = targetStats.resistances.get(status).value;
    return chance - resistance;
  }
}
