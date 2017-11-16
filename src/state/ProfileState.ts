import {computed, observable, transaction} from "mobx";
import {Path} from "./RouterState";
import {HeroGenerator, ItemGenerator, QuestGenerator} from "./Generators";
import {serializable, object, identifier, date, list, reference} from "serializr";
import uuid = require("uuid");
import {
  AfflictionInfo, CharacterClassInfo, DungeonInfo, ItemInfo, QuestInfo,
  StaticState
} from "./StaticState";
import {Bounds} from "../Bounds";

let nullEstateEvent: EstateEvent;
let nullProfile: Profile;

export type ProfileId = string;
export type CharacterId = string;
export type ItemId = string;
export type QuestId = string;
export type DungeonId = string;
export type CurioId = string;
export type MapLocationId = string;

export class Vector {
  @serializable x: number = 0;
  @serializable y: number = 0;

  get id () {
    return this.x + "_" + this.y;
  }

  constructor (x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  add (other: Vector) {
    return new Vector(
      this.x + other.x,
      this.y + other.y
    );
  }
}

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

export class EstateEvent {
  @serializable @observable message: string;
  @serializable @observable shown: boolean;
}

export class Experienced {
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

export class Curio {
  @serializable(identifier()) id: CurioId = uuid();
  @serializable name: string;
}

export class MapLocation {
  @serializable(identifier()) id: MapLocationId = uuid();
  @serializable(list(object(Curio))) curios: Curio[] = [];
}

export class Room extends MapLocation {
  @serializable(object(Vector))
  coordinates: Vector;

  static walk (
    memory: Map<string, Room> = new Map<string, Room>(),
    stepsLeft: number = 10,
    coordinates: Vector = new Vector()
  ) {
    const roomId = coordinates.id;
    const room = memory.get(roomId) || new Room();
    room.coordinates = coordinates;
    memory.set(roomId, room);

    if (stepsLeft <= 0) {
      return room;
    }

    const direction: Vector = Math.random() > 0.5 ?
      new Vector(Math.random() ? -1 : 1, 0) :
      new Vector(0, Math.random() ? -1 : 1);

    const nextCoordinate = coordinates.add(direction);

    Room.walk(memory, stepsLeft - 1, nextCoordinate);

    return room;
  }
}

export class QuestMap {
  @serializable(list(object(Room))) rooms: Room[];
  @serializable(object(Room)) entrance: Room;
  @serializable size: MapSize = MapSize.Short;

  get bounds () {
    return QuestMap.findBoundingBox(this.rooms);
  }

  static generate (size: MapSize) {
    const memory = new Map<string, Room>();
    const m = new QuestMap();
    m.size = size;
    m.entrance = Room.walk(memory, 16);
    m.rooms = Array.from(memory.values());
    return m;
  }

  static findBoundingBox (rooms: Room[]) {
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;
    rooms.forEach((room) => {
      if (room.coordinates.x < minX) { minX = room.coordinates.x; }
      if (room.coordinates.x > maxX) { maxX = room.coordinates.x; }
      if (room.coordinates.y < minY) { minY = room.coordinates.y; }
      if (room.coordinates.y > maxY) { maxY = room.coordinates.y; }
    });
    return new Bounds(0, 0, maxX - minX, maxY - minY);
  }
}

export class Quest {
  @serializable(identifier()) id: QuestId = uuid();
  @serializable bonfires: number = 0;
  @serializable level: number = 0;
  @serializable dungeonId: DungeonId;

  @serializable(object(QuestMap))
  map: QuestMap;

  @serializable(object(QuestObjective))
  objective: QuestObjective = new QuestObjective();

  @serializable(list(object(Item)))
  rewards: Item[] = [];

  // Data that changes throughout a quest
  @serializable @observable status: QuestStatus = QuestStatus.Idle;
  @serializable @observable light: number = 1;
  @serializable @observable battle?: Battle;

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

export class Battle {
  @serializable @observable round: number = 0;
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

    if (this.week === 0) {
      // The quest on the first week should always be the same
      this.quests = [
        // TODO generate start quest
        questGenerator.next(this.dungeons)
      ];
    } else {
      // Randomize quests each week
      this.quests = [
        questGenerator.next(this.dungeons),
        questGenerator.next(this.dungeons),
        questGenerator.next(this.dungeons)
      ];
    }

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
