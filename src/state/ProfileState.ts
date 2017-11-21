import {computed, observable} from "mobx";
import {StaticState} from "./StaticState";
import {Difficulty, Profile, ProfileId} from "./types/Profile";
import {Dungeon} from "./types/Dungeon";
import {Path} from "./types/Path";
import {Item} from "./types/Item";
import {count} from "../lib/Helpers";

export class ProfileState {
  @observable private activeProfileId: ProfileId;
  @observable map = new Map<ProfileId, Profile>();

  @computed get activeProfile () {
    return this.map.get(this.activeProfileId);
  }

  createProfile (difficulty: Difficulty) {
    const profile = new Profile();

    // Basic settings
    profile.difficulty = difficulty;
    profile.name = difficulty.toString();
    profile.gold = 2000;

    // Add some of each heirloom
    StaticState.instance.heirlooms.forEach((heirloom) => {
      count(10).forEach(() =>
        profile.items.push(Item.fromInfo(heirloom))
      );
    });

    // Add all dungeons to profile
    profile.dungeons = Array.from(StaticState.instance.dungeons.values())
      .map(Dungeon.fromInfo);

    // Add two random heroes to the roster
    profile.roster = [profile.newHero(), profile.newHero()];
    profile.roster.forEach((hero) => profile.joinParty(hero));

    // Set starting quest
    const startQuest = profile.newQuest();
    profile.quests = [startQuest];
    profile.selectedQuestId = startQuest.id;

    // Put profile on the path to load into the quest dungeon
    profile.path = new Path("dungeonOverview");

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
