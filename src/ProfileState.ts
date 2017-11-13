import {computed, observable, transaction} from "mobx";
import {Path} from "./RouterState";
import {CharacterGenerator, ItemGenerator, QuestGenerator} from "./Generators";
import {serializable, object, identifier, date, list, reference} from "serializr";
import uuid = require("uuid");
import {AfflictionInfo, CharacterClassInfo, DungeonInfo, ItemInfo, LevelInfo, QuestInfo} from "./config/general";

let nullEstateEvent: EstateEvent;
let nullProfile: Profile;

export type ProfileId = string;
export type CharacterId = string;
export type ItemId = string;
export type QuestId = string;
export type DungeonId = string;

export class ProfileState {
  @observable private activeProfileId: ProfileId;
  @observable map = new Map<ProfileId, Profile>();

  @computed get activeProfile () {
    return this.map.get(this.activeProfileId) || this.pullNullProfile();
  }

  constructor (
    private characterGenerator: CharacterGenerator,
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

    profile.characters = [
      this.characterGenerator.next(),
      this.characterGenerator.next()
    ];

    profile.items = [
      this.itemGenerator.next(),
      this.itemGenerator.next(),
      this.itemGenerator.next(),
      this.itemGenerator.next()
    ];

    // Assign one item to each character
    profile.items[0].characterId = profile.characters[0].id;
    profile.items[1].characterId = profile.characters[1].id;

    // Add all dungeons to profile
    profile.dungeons = Array.from(DungeonInfo.lookup.values())
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

export class EstateEvent {
  @serializable @observable message: string;
  @serializable @observable shown: boolean;
}

export class Adventure {
  @serializable @observable status = AdventureStatus.Pending;
}

class Experienced {
  @serializable @observable experience: number = 0;

  @computed get relativeExperience () {
    return this.experience - this.level.experience;
  }

  @computed get level () {
    return Array.from(LevelInfo.lookup.values())
      .find((level) =>
        this.experience >= level.experience &&
        (level.isMax || this.experience < level.next.experience)
      );
  }

  @computed get levelProgress () {
    if (this.level.isMax) {
      return 1;
    }
    return this.relativeExperience / this.level.next.relativeExperience;
  }
}

export class Character extends Experienced {
  @serializable(identifier()) id: CharacterId = uuid();
  @serializable @observable rosterIndex: number = 0;
  @serializable @observable name: string;
  @serializable @observable inParty: boolean;

  @serializable(reference(CharacterClassInfo, CharacterClassInfo.lookupFn))
  classInfo: CharacterClassInfo;

  @serializable(reference(AfflictionInfo, AfflictionInfo.lookupFn))
  affliction: AfflictionInfo;

  @serializable @observable stress: number = 0;

  @computed get stressPercentage () {
    return this.stress / this.stressMax;
  }

  get stressMax (): number {
    return 200;
  }

  static comparers = {
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

  static visibleComparers = (() => {
    const dict = {...Character.comparers};
    delete dict.rosterIndex;
    return dict;
  })();
}

export class Item {
  @serializable(identifier()) id: ItemId = uuid();
  @serializable @observable isOnAdventure: boolean;
  @serializable @observable characterId?: CharacterId;
  @serializable @observable level: number = 0;

  @serializable(reference(ItemInfo, ItemInfo.lookupFn))
  itemInfo: ItemInfo;

  static comparers = {
    name (a: Item, b: Item) {
      return a.itemInfo.name.localeCompare(b.itemInfo.name);
    }
  };

  static fromInfo (info: ItemInfo) {
    const item = new Item();
    item.itemInfo = info;
    return item;
  }
}

export class QuestObjective {
  @serializable explorePercentage: number = 0;
  @serializable monsterPercentage: number = 0;
}

export class Quest {
  @serializable(identifier()) id: QuestId = uuid();
  @serializable bonfires: number = 0;
  @serializable level: number = 0;
  @serializable mapSize: MapSize = MapSize.Short;
  @serializable dungeonId: DungeonId;

  @serializable(object(QuestObjective))
  objective: QuestObjective = new QuestObjective();

  @serializable(list(object(Item)))
  rewards: Item[] = [];

  get info (): QuestInfo {
    if (this.objective.monsterPercentage) {
      return QuestInfo.hunt;
    } else if (this.objective.explorePercentage) {
      return QuestInfo.explore;
    }
    return QuestInfo.free;
  }
}

export class Dungeon extends Experienced {
  @serializable(identifier()) id: ItemId = uuid();

  @serializable(reference(DungeonInfo, DungeonInfo.lookupFn))
  dungeonInfo: DungeonInfo;

  static fromInfo (info: DungeonInfo) {
    const dungeon = new Dungeon();
    dungeon.dungeonInfo = info;
    return dungeon;
  }
}

export class Profile {
  @serializable(identifier()) id: ProfileId = uuid();
  @serializable difficulty: Difficulty;
  @serializable @observable isNameFinalized: boolean;
  @serializable @observable name: string;
  @serializable(object(Path)) @observable path: Path;
  @serializable @observable week: number = -1;
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

  @serializable(list(object(Quest)))
  @observable
  quests: Quest[] = [];

  @serializable(list(object(Item)))
  @observable
  items: Item[] = [];

  @serializable(list(object(Dungeon)))
  @observable
  dungeons: Dungeon[] = [];

  @computed get party () {
    return this.characters.filter((c) => c.inParty);
  }

  @computed get isPartyFull () {
    return this.party.length === this.maxPartySize;
  }

  @computed get unassignedItems () {
    return this.items.filter((item) =>
      !item.isOnAdventure && item.characterId === undefined
    );
  }

  get rosterSize () {
    return 9; // TODO should derive from upgrades
  }

  get maxPartySize () {
    return 4; // TODO should derive from upgrades
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

  unequipAllItems () {
    transaction(() => {
      this.items.forEach((item) =>
        item.characterId = undefined
      );
    });
  }

  gotoNextWeek (questGenerator: QuestGenerator) {
    this.week++;

    // Randomize estate event
    const eventIndex = Math.floor(100 * Math.random());
    const newEvent = new EstateEvent();
    newEvent.message = "Event " + eventIndex;
    this.estateEvent = newEvent;

    // Randomize quests
    this.quests = [
      questGenerator.next(this.dungeons),
      questGenerator.next(this.dungeons),
      questGenerator.next(this.dungeons)
    ];
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

export enum MapSize {
  Short = "Short",
  Medium = "Medium",
  Long = "Long"
}

nullEstateEvent = new EstateEvent();
nullEstateEvent.shown = true;
