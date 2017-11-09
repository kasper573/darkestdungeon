import {computed, observable} from "mobx";
import {Path} from "./RouterState";

export type ProfileId = number;

export class ProfileState {
  @observable private activeProfileId: ProfileId;
  @observable map = new Map<ProfileId, Profile>();

  @computed get activeProfile () {
    return this.map.get(this.activeProfileId) || nullProfile;
  }

  createProfile (difficulty: Difficulty) {
    const profile = new Profile(
      undefined, difficulty.toString(), false,
      difficulty, undefined, 0, new Date()
    );

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

  @computed get hasBegun () {
    return !!this.path;
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

const nullProfile = new Profile(
  undefined, "Null", true,
  Difficulty.Darkest, undefined, 0, new Date()
);
