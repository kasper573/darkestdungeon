import {computed, observable, transaction} from "mobx";
import {Path} from "./RouterState";
import {HeroGenerator, ItemGenerator, QuestGenerator} from "./Generators";
import {serializable, object, identifier, date, list, reference} from "serializr";
import uuid = require("uuid");
import {
  AfflictionInfo, CharacterClassInfo, DungeonInfo, ItemInfo, QuestInfo,
  StaticState
} from "./StaticState";

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

export class EstateEvent {
  @serializable @observable message: string;
  @serializable @observable shown: boolean;
}

class Experienced {
  @serializable @observable experience: number = 0;

  @computed get relativeExperience () {
    return this.experience - this.level.experience;
  }

  @computed get level () {
    return Array.from(StaticState.instance.levels.values())
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
  @serializable @observable name: string;
  @serializable @observable stress: number = 0;

  @serializable(reference(CharacterClassInfo, StaticState.lookup((i) => i.heroClasses)))
  classInfo: CharacterClassInfo;

  @serializable(reference(AfflictionInfo, StaticState.lookup((i) => i.afflictions)))
  affliction: AfflictionInfo;

  @computed get stressPercentage () {
    return this.stress / this.stressMax;
  }

  get stressMax (): number {
    return 200;
  }
}

export class Hero extends Character {
  @serializable @observable rosterIndex: number = 0;
  @serializable @observable inParty: boolean;

  static comparers = {
    name (a: Hero, b: Hero) {
      return a.name.localeCompare(b.name);
    },

    className (a: Hero, b: Hero) {
      return a.classInfo.name.localeCompare(b.classInfo.name);
    },

    rosterIndex (a: Hero, b: Hero) {
      if (a.rosterIndex === b.rosterIndex) {
        return 0;
      }
      return a.rosterIndex < b.rosterIndex ? - 1 : 1;
    }
  };

  static visibleComparers = (() => {
    const dict = {...Hero.comparers};
    delete dict.rosterIndex;
    return dict;
  })();
}

export class Item {
  @serializable(identifier()) id: ItemId = uuid();
  @serializable @observable heroId?: CharacterId;
  @serializable @observable level: number = 0;

  @serializable(reference(ItemInfo, StaticState.lookup((i) => i.items)))
  info: ItemInfo;

  static comparers = {
    name (a: Item, b: Item) {
      return a.info.name.localeCompare(b.info.name);
    }
  };

  static fromInfo (info: ItemInfo) {
    const item = new Item();
    item.info = info;
    return item;
  }
}

export class QuestObjective {
  @serializable explorePercentage: number = 0;
  @serializable monsterPercentage: number = 0;

  get description () {
    const strings: string[] = [];
    if (this.monsterPercentage > 0) {
      strings.push(`Slay ${(this.monsterPercentage * 100).toFixed(0)}% of monsters`);
    }
    if (this.explorePercentage > 0) {
      strings.push(`Explore ${(this.explorePercentage * 100).toFixed(0)}% of rooms`);
    }
    return strings.join(" and ");
  }
}

export class Quest {
  @serializable(identifier()) id: QuestId = uuid();
  @serializable bonfires: number = 0;
  @serializable level: number = 0;
  @serializable mapSize: MapSize = MapSize.Short;
  @serializable dungeonId: DungeonId;
  @serializable status: QuestStatus = QuestStatus.Idle;

  @serializable(object(QuestObjective))
  objective: QuestObjective = new QuestObjective();

  @serializable(list(object(Item)))
  rewards: Item[] = [];

  get isFinished () {
    return this.status === QuestStatus.Victory ||
      this.status === QuestStatus.Escape ||
      this.status === QuestStatus.Defeat;
  }

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

  @serializable(reference(DungeonInfo, StaticState.lookup((i) => i.dungeons)))
  info: DungeonInfo;

  static fromInfo (info: DungeonInfo) {
    const dungeon = new Dungeon();
    dungeon.info = info;
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
  @serializable @observable selectedQuestId?: QuestId;
  @serializable @observable gold: number = 0;

  @serializable(object(EstateEvent))
  @observable
  estateEvent = nullEstateEvent;

  @serializable(list(object(Hero)))
  @observable
  heroes: Hero[] = [];

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
    return this.heroes.filter((c) => c.inParty);
  }

  @computed get isPartyFull () {
    return this.party.length === this.maxPartySize;
  }

  @computed get selectedQuest () {
    return this.quests.find((q) => q.id === this.selectedQuestId);
  }

  @computed get unassignedItems () {
    return this.items.filter((item) => item.heroId === undefined);
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

  sortHeroes (compareFn: (a: Hero, b: Hero) => number) {
    transaction(() => {
      this.heroes = this.heroes.sort(compareFn);
      this.heroes.forEach((hero, index) => {
        hero.rosterIndex = index;
      });
    });
  }

  generateStoreItems (itemGenerator: ItemGenerator) {
    return [
      itemGenerator.next(),
      itemGenerator.next(),
      itemGenerator.next()
    ];
  }

  unequipAllItems () {
    transaction(() => {
      this.items.forEach((item) =>
        item.heroId = undefined
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
    this.selectedQuestId = this.quests[0].id;
  }
}

export enum QuestStatus {
  Idle = "Idle",
  Started = "Started",
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
