import {computed, observable, transaction} from "mobx";
import {Path} from "./RouterState";
import {Adventure, Character, EstateEvent} from "./ProfileData";
import {CharacterGenerator} from "./CharacterGenerator";

export type ProfileId = number;

export class ProfileState {
  private characterGenerator: CharacterGenerator;

  @observable private activeProfileId: ProfileId;
  @observable map = new Map<ProfileId, Profile>();

  @computed get activeProfile () {
    return this.map.get(this.activeProfileId) ||
      (nullProfile = this.createProfile(Difficulty.Radiant));
  }

  constructor (characterGenerator: CharacterGenerator) {
    this.characterGenerator = characterGenerator;
  }

  createProfile (difficulty: Difficulty) {
    const profile = new Profile(
      undefined, difficulty.toString(), false,
      difficulty, undefined, 0, new Date()
    );

    profile.characters = [
      this.characterGenerator.next(),
      this.characterGenerator.next()
    ];

    this.addProfile(profile);
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

let idCounter = 0;
export class Profile {
  @observable public isNameFinalized: boolean;
  @observable public name: string;
  @observable public path: Path;
  @observable public week: number;
  @observable public dateOfLastSave: Date;

  @observable public estateEvent = new EstateEvent("Null", true);
  @observable public adventure = new Adventure();
  @observable public characters: Character[] = [];

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
      this.id = idCounter++;
    }
    this.name = name;
    this.isNameFinalized = isNameFinalized;
    this.path = path;
    this.week = week;
    this.dateOfLastSave = dateOfLastSave;
  }
}

export enum Difficulty {
  Radiant = "Radiant",
  Darkest = "Darkest",
  Stygian = "Stygian"
}

let nullProfile;
