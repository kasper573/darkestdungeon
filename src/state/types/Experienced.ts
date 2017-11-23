import {serializable} from "serializr";
import {computed, observable} from "mobx";
import {StaticState} from "../StaticState";

export class Experienced {
  @serializable @observable experience: number = 0;

  @computed
  get relativeExperience () {
    return this.experience - this.level.experience;
  }

  @computed
  get level () {
    return StaticState.instance.levels.find((level) =>
      this.experience >= level.experience &&
      (level.isMax || this.experience < level.next.experience)
    );
  }

  @computed
  get levelProgress () {
    if (this.level.isMax) {
      return 1;
    }
    return this.relativeExperience / this.level.next.relativeExperience;
  }
}
