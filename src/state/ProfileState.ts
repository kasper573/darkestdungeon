import {computed, observable} from "mobx";
import {HeroGenerator, ItemGenerator, QuestGenerator} from "./Generators";
import {StaticState} from "./StaticState";
import {Difficulty, Profile, ProfileId} from "./types/Profile";
import {Dungeon} from "./types/Dungeon";

export class ProfileState {
  @observable private activeProfileId: ProfileId;
  @observable map = new Map<ProfileId, Profile>();

  @computed get activeProfile () {
    return this.map.get(this.activeProfileId);
  }

  constructor (
    private heroGenerator: HeroGenerator,
    private itemGenerator: ItemGenerator,
    private questGenerator: QuestGenerator
  ) {}

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

    // Give one item to each hero
    profile.heroes[0].items = [this.itemGenerator.next()];
    profile.heroes[1].items = [this.itemGenerator.next()];

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
