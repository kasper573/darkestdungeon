import {computed, observable} from "mobx";
import {StaticState} from "../StaticState";
import {identifier, reference, serializable} from "serializr";
import uuid = require("uuid");
import {Experienced} from "./Experienced";
import {AfflictionInfo} from "./AfflictionInfo";
import {CharacterClassInfo} from "./CharacterClassInfo";

export type CharacterId = string;

export class Character extends Experienced {
  @serializable(identifier()) id: CharacterId = uuid();
  @serializable @observable name: string;
  @serializable @observable stress: number = 0;

  @serializable(reference(CharacterClassInfo, StaticState.lookup((i) => i.heroClasses)))
  classInfo: CharacterClassInfo;

  @serializable(reference(AfflictionInfo, StaticState.lookup((i) => i.afflictions)))
  affliction: AfflictionInfo;

  @computed get stressPercentage () {
    return this.stress / this.stressMax;
  }

  get stressMax (): number {
    return 200;
  }
}
