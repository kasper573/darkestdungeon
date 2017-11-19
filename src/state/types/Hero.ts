import {Character} from "./Character";
import {serializable} from "serializr";
import {observable} from "mobx";

export class Hero extends Character {
  @serializable @observable rosterIndex: number = 0;
  @serializable @observable partyIndex: number = -1;
  @serializable @observable inParty: boolean;

  leaveParty () {
    this.inParty = false;
    this.partyIndex = -1;
  }

  static comparers = {
    name (a: Hero, b: Hero) {
      return a.name.localeCompare(b.name);
    },

    className (a: Hero, b: Hero) {
      return a.classInfo.name.localeCompare(b.classInfo.name);
    },

    rosterIndex (a: Hero, b: Hero) {
      if (a.rosterIndex === b.rosterIndex) {
        return 0;
      }
      return a.rosterIndex < b.rosterIndex ? - 1 : 1;
    }
  };

  static visibleComparers = (() => {
    const dict = {...Hero.comparers};
    delete dict.rosterIndex;
    return dict;
  })();
}
