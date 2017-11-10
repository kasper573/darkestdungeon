import {observable} from "mobx";

// Temporary structure/filename, may need to be renamed/moved elsewhere

export class EstateEvent {
  @observable public shown: boolean;

  constructor (
    public message: string,
    shown: boolean = false
  ) {
    this.shown = shown;
  }
}

export class Adventure {
  @observable status = AdventureStatus.Pending;
}

let idCounter = 0;
export class Character {
  public id: number;
  @observable rosterIndex: number = 0;
  @observable name: string;

  constructor (
    name: string,
    public classInfo: CharacterClass
  ) {
    this.id = idCounter++;
    this.name = name;
  }

  public static comparers = {
    name (a: Character, b: Character) {
      return a.name.localeCompare(b.name);
    },

    className (a: Character, b: Character) {
      return a.classInfo.name.localeCompare(b.classInfo.name);
    },

    rosterIndex (a: Character, b: Character) {
      if (a.rosterIndex === b.rosterIndex) {
        return 0;
      }
      return a.rosterIndex < b.rosterIndex ? - 1 : 1;
    }
  };

  public static visibleComparers = (() => {
    const dict = {...Character.comparers};
    delete dict.rosterIndex;
    return dict;
  })();
}

export class CharacterClass {
  constructor (
    public name: string
  ) {}
}

export enum AdventureStatus {
  Pending = "Pending",
  Defeat = "Defeat",
  Escape = "Escape",
  Victory = "Victory"
}
