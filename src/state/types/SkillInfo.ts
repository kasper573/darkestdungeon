import {identifier, serializable} from "serializr";
import {IStatsSource, Stats, TurnStats} from "./Stats";

export type SkillSpots = [boolean, boolean, boolean, boolean];

export enum SkillTargetObject {
  Ally,
  Enemy
}

export class SkillTarget {
  constructor (
    public spots?: SkillSpots,
    public object?: SkillTargetObject
  ) {}

  static oneOf (
    spots: SkillSpots,
    object: SkillTargetObject = SkillTargetObject.Enemy
  ) {
    return new SkillTarget(spots, object);
  }

  static anyOne (type: SkillTargetObject) {
    return SkillTarget.oneOf([true, true, true, true], type);
  }
}

export type SkillId = string;

export class SkillInfo implements IStatsSource {
  @serializable(identifier()) id: SkillId;
  name: string;
  statsSourceName: string = "Skill";
  stats: Stats;

  position: [boolean, boolean, boolean, boolean] = [true, true, true, true];
  damageScale: number = 1;
  movement: number = 0;
  statusTurns: number = 3;
  target: SkillTarget;
  buff: TurnStats;
}
