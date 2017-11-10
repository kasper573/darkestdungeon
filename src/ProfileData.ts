import {computed, observable} from "mobx";
import {CharacterId, TrinketId} from "./ProfileState";

let characterIdCounter = 0;
let trinketIdCounter = 0;

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

export class Character {
  public id: CharacterId;

  @observable rosterIndex: number = 0;
  @observable name: string;

  @computed get trinkets (): Trinket[] {
    return this.profile.trinkets.filter(
      (trinket: Trinket) => trinket.characterId === this.id
    );
  }

  constructor (
    id: CharacterId,
    name: string,
    public classInfo: CharacterClass,
    private profile: any
  ) {
    this.id = id !== undefined ? id : characterIdCounter++;
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

export class Trinket {
  @observable public isOnAdventure: boolean;
  @observable public characterId?: CharacterId;

  constructor (
    public id: TrinketId,
    public name: string,
    isOnAdventure: boolean = false,
    characterId?: number
  ) {
    if (this.id === undefined) {
      this.id = trinketIdCounter++;
    }
    this.isOnAdventure = isOnAdventure;
    this.characterId = characterId;
  }

  public static comparers = {
    name (a: Trinket, b: Trinket) {
      return a.name.localeCompare(b.name);
    }
  };
}

export enum AdventureStatus {
  Pending = "Pending",
  Defeat = "Defeat",
  Escape = "Escape",
  Victory = "Victory"
}
