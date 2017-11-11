import {computed, observable, transaction} from "mobx";
import {Path} from "./RouterState";
import {CharacterGenerator, ItemGenerator} from "./Generators";
import {serializable, object, identifier, date, list} from "serializr";
import uuid = require("uuid");

let nullEstateEvent: EstateEvent;
let nullProfile: Profile;

export type ProfileId = string;
export type CharacterId = string;
export type TrinketId = string;

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
    const profile = new Profile();
    profile.difficulty = difficulty;
    profile.name = difficulty.toString();

    profile.characters = [
      this.characterGenerator.next(),
      this.characterGenerator.next()
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

export class EstateEvent {
  @serializable @observable message: string;
  @serializable @observable shown: boolean;
}

export class Adventure {
  @serializable @observable status = AdventureStatus.Pending;
}

export class Character {
  @serializable(identifier()) id: CharacterId = uuid();
  @serializable @observable rosterIndex: number = 0;
  @serializable @observable name: string;

  static comparers = {
    name (a: Character, b: Character) {
      return a.name.localeCompare(b.name);
    },

    rosterIndex (a: Character, b: Character) {
      if (a.rosterIndex === b.rosterIndex) {
        return 0;
      }
      return a.rosterIndex < b.rosterIndex ? - 1 : 1;
    }
  };

  static visibleComparers = (() => {
    const dict = {...Character.comparers};
    delete dict.rosterIndex;
    return dict;
  })();
}

export class Trinket {
  @serializable(identifier()) id: TrinketId = uuid();
  @serializable name: string;
  @serializable @observable isOnAdventure: boolean;
  @serializable @observable characterId?: CharacterId;

  static comparers = {
    name (a: Trinket, b: Trinket) {
      return a.name.localeCompare(b.name);
    }
  };
}

export class Profile {
  @serializable(identifier()) id: ProfileId = uuid();
  @serializable difficulty: Difficulty;
  @serializable @observable isNameFinalized: boolean;
  @serializable @observable name: string;
  @serializable(object(Path)) @observable path: Path;
  @serializable @observable week: number = 0;
  @serializable(date()) @observable dateOfLastSave: Date = new Date();

  @serializable(object(EstateEvent))
  @observable
  estateEvent = nullEstateEvent;

  @serializable(object(Adventure))
  @observable
  adventure = new Adventure();

  @serializable(list(object(Character)))
  @observable
  characters: Character[] = [];

  @serializable(list(object(Trinket)))
  @observable
  trinkets: Trinket[] = [];

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

nullEstateEvent = new EstateEvent();
nullEstateEvent.shown = true;
