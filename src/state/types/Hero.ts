import {Character} from "./Character";
import {object, serializable} from "serializr";
import {observable, transaction} from "mobx";
import {HeroResidentInfo} from "./HeroResidentInfo";
import {BuildingInfoId} from "./BuildingInfo";

export class Hero extends Character {
  @serializable @observable rosterIndex: number = 0;
  @serializable @observable partyIndex: number = -1;
  @serializable @observable inParty: boolean;

  @serializable(object(HeroResidentInfo))
  @observable
  residentInfo?: HeroResidentInfo;

  leaveParty () {
    this.inParty = false;
    this.partyIndex = -1;
  }

  enterResidence (buildingId: BuildingInfoId, slotIndex: number) {
    transaction(() => {
      this.residentInfo = new HeroResidentInfo();
      this.residentInfo.buildingId = buildingId;
      this.residentInfo.slotIndex = slotIndex;
    });
  }

  lockInResidency () {
    this.leaveParty();
    this.residentInfo.isLockedIn = true;
  }

  leaveResidence () {
    this.residentInfo = null;
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
