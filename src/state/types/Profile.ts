import {date, identifier, list, object, serializable} from "serializr";
import uuid = require("uuid");
import {computed, observable, transaction} from "mobx";
import {Path} from "../RouterState";
import {EstateEvent} from "./EstateEvent";
import {Hero} from "./Hero";
import {Quest, QuestId} from "./Quest";
import {Item} from "./Item";
import {Dungeon} from "./Dungeon";
import {ItemGenerator, QuestGenerator} from "../Generators";

export type ProfileId = string;

const nullEstateEvent = new EstateEvent();
nullEstateEvent.shown = true;

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

export enum Difficulty {
  Radiant = "Radiant",
  Darkest = "Darkest",
  Stygian = "Stygian"
}
