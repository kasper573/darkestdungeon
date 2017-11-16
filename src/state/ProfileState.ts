import {computed, observable} from "mobx";
import {HeroGenerator, ItemGenerator, QuestGenerator} from "./Generators";
import {StaticState} from "./StaticState";
import {Difficulty, Profile, ProfileId} from "./types/Profile";
import {Dungeon} from "./types/Dungeon";

let nullProfile: Profile;

export class ProfileState {
  @observable private activeProfileId: ProfileId;
  @observable map = new Map<ProfileId, Profile>();

  @computed get activeProfile () {
    return this.map.get(this.activeProfileId) || this.pullNullProfile();
  }

  constructor (
    private heroGenerator: HeroGenerator,
    private itemGenerator: ItemGenerator,
    private questGenerator: QuestGenerator
  ) {}

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
    profile.gold = 250;

    profile.heroes = [
      this.heroGenerator.next(),
      this.heroGenerator.next()
    ];

    profile.items = [
      this.itemGenerator.next(),
      this.itemGenerator.next(),
      this.itemGenerator.next(),
      this.itemGenerator.next()
    ];

    profile.heroes[0].inParty = true;
    profile.heroes[1].inParty = true;

    // Assign one item to each hero
    profile.items[0].heroId = profile.heroes[0].id;
    profile.items[1].heroId = profile.heroes[1].id;

    // Add all dungeons to profile
    profile.dungeons = Array.from(StaticState.instance.dungeons.values())
      .map(Dungeon.fromInfo);

    profile.gotoNextWeek(this.questGenerator);

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
