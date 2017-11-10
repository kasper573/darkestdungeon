import {computed, observable, transaction} from "mobx";
import {Path} from "./RouterState";
import {CharacterGenerator, ItemGenerator} from "./Generators";

let nullProfile: Profile;
let profileIdCounter = 0;
let characterIdCounter = 0;
let trinketIdCounter = 0;

export type ProfileId = number;
export type CharacterId = number;
export type TrinketId = number;

export class ProfileState {
  private characterGenerator: CharacterGenerator;
  private itemGenerator: ItemGenerator;

  @observable private activeProfileId: ProfileId;
  @observable map = new Map<ProfileId, Profile>();

  @computed get activeProfile () {
    return this.map.get(this.activeProfileId) || this.pullNullProfile();
  }

  constructor (
    characterGenerator: CharacterGenerator,
    itemGenerator: ItemGenerator
  ) {
    this.characterGenerator = characterGenerator;
    this.itemGenerator = itemGenerator;
  }

  private pullNullProfile () {
    if (nullProfile) {
      return nullProfile;
    }

    nullProfile = this.createProfile(Difficulty.Radiant, false);
    nullProfile.name = "Null";
    nullProfile.isNameFinalized = true;
    return nullProfile;
  }

  createProfile (difficulty: Difficulty, add: boolean = true) {
    const profile = new Profile(
      undefined, difficulty.toString(), false,
      difficulty, undefined, 0, new Date()
    );

    profile.characters = [
      this.characterGenerator.next(profile),
      this.characterGenerator.next(profile)
    ];

    profile.trinkets = [
      this.itemGenerator.nextTrinket(),
      this.itemGenerator.nextTrinket(),
      this.itemGenerator.nextTrinket(),
      this.itemGenerator.nextTrinket()
    ];

    profile.trinkets[0].characterId = profile.characters[0].id;
    profile.trinkets[1].characterId = profile.characters[1].id;

    if (add) {
      this.addProfile(profile);
    }

    return profile;
  }

  addProfile (profile: Profile) {
    this.map.set(profile.id, profile);
  }

  deleteProfile (id: ProfileId) {
    this.map.delete(id);
  }

  setActiveProfile (id: ProfileId) {
    this.activeProfileId = id;
  }
}

export class Profile {
  @observable public isNameFinalized: boolean;
  @observable public name: string;
  @observable public path: Path;
  @observable public week: number;
  @observable public dateOfLastSave: Date;

  @observable public estateEvent = new EstateEvent("Null", true);
  @observable public adventure = new Adventure();
  @observable public characters: Character[] = [];
  @observable public trinkets: Trinket[] = [];

  @computed get unassignedTrinkets () {
    return this.trinkets.filter((trinket) =>
      !trinket.isOnAdventure && trinket.characterId === undefined
    );
  }

  get rosterSize () {
    return 9; // TODO should derive from upgrades
  }

  @computed get hasBegun () {
    return !!this.path;
  }

  sortCharacters (compareFn: (a: Character, b: Character) => number) {
    transaction(() => {
      this.characters = this.characters.sort(compareFn);
      this.characters.forEach((character, index) => {
        character.rosterIndex = index;
      });
    });
  }

  unequipAllTrinkets () {
    transaction(() => {
      this.trinkets.forEach((trinket) =>
        trinket.characterId = undefined
      );
    });
  }

  constructor (
    public id: ProfileId,
    name: string,
    isNameFinalized: boolean,
    public difficulty: Difficulty,
    path: Path,
    week: number,
    dateOfLastSave: Date
  ) {
    if (id === undefined) {
      this.id = profileIdCounter++;
    }
    this.name = name;
    this.isNameFinalized = isNameFinalized;
    this.path = path;
    this.week = week;
    this.dateOfLastSave = dateOfLastSave;
  }
}

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
    private profile: Profile
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

export enum Difficulty {
  Radiant = "Radiant",
  Darkest = "Darkest",
  Stygian = "Stygian"
}
