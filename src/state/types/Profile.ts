import {date, identifier, list, object, serializable} from "serializr";
import uuid = require("uuid");
import {computed, observable, transaction} from "mobx";
import {Path} from "./Path";
import {EstateEvent} from "./EstateEvent";
import {Hero} from "./Hero";
import {Quest, QuestId} from "./Quest";
import {Item} from "./Item";
import {Dungeon} from "./Dungeon";
import {generateHero, generateItem, generateQuest} from "../Generators";
import {moveItem} from "../../lib/ArrayHelpers";

export type ProfileId = string;

const nullEstateEvent = new EstateEvent();
nullEstateEvent.shown = true;

export class Profile {
  @serializable(identifier()) id: ProfileId = uuid();
  @serializable difficulty: Difficulty;
  @serializable @observable isNameFinalized: boolean;
  @serializable @observable name: string;
  @serializable(object(Path)) @observable path: Path;
  @serializable @observable week: number = 0;
  @serializable(date()) @observable dateOfLastSave: Date = new Date();
  @serializable @observable selectedQuestId?: QuestId;
  @serializable @observable gold: number = 0;

  @serializable(object(EstateEvent))
  @observable
  estateEvent = nullEstateEvent;

  @serializable(list(object(Hero)))
  @observable
  coach: Hero[] = [];

  @serializable(list(object(Hero)))
  @observable
  roster: Hero[] = [];

  @serializable(list(object(Hero)))
  @observable
  graveyard: Hero[] = [];

  @serializable(list(object(Quest)))
  @observable
  quests: Quest[] = [];

  @serializable(list(object(Item)))
  @observable
  items: Item[] = [];

  @serializable(list(object(Dungeon)))
  @observable
  dungeons: Dungeon[] = [];

  @computed get partySlots () {
    const members: Hero[] = [undefined, undefined, undefined, undefined];
    this.party.forEach((member) => members[member.partyIndex] = member);
    return members;
  }

  @computed get party () {
    return this.roster
      .filter((c) => c.inParty)
      .sort((a, b) => {
        if (a.partyIndex === b.partyIndex) {
          return 0;
        }
        return a.partyIndex < b.partyIndex ? -1 : 1;
      });
  }

  @computed get isPartyFull () {
    return this.party.length === 4;
  }

  @computed get selectedQuest () {
    return this.quests.find((q) => q.id === this.selectedQuestId);
  }

  @computed get selectedDungeon () {
    if (this.selectedQuest) {
      return this.dungeons.find((d) => d.id === this.selectedQuest.dungeonId);
    }
  }

  get rosterSize () {
    return 9; // TODO should derive from upgrades
  }

  joinParty (newHero: Hero, slotIndex: number = -1) {
    if (slotIndex === -1) {
      slotIndex = this.partySlots.findIndex((member) => !member);
      if (slotIndex === -1) {
        throw new Error("Can't join full party");
      }
    }

    const oldHero = this.partySlots[slotIndex];

    // Slot is free, join directly
    if (!oldHero) {
      newHero.inParty = true;
      newHero.partyIndex = slotIndex;
      return;
    }

    // Slot is taken, make space
    if (newHero.inParty) {
      // Hero just wants to swap places in the party
      const oldIndex = newHero.partyIndex;
      newHero.partyIndex = slotIndex;
      oldHero.partyIndex = oldIndex;
    } else {
      // Let new hero take the old ones place
      newHero.inParty = true;
      newHero.partyIndex = slotIndex;

      // Move old hero to a new slot if it exists, otherwise kick from party
      oldHero.leaveParty();
      const availableIndex = this.partySlots.findIndex((member) => !member);
      if (availableIndex !== -1) {
        oldHero.inParty = true;
        oldHero.partyIndex = availableIndex;
      }
    }
  }

  killHero (hero: Hero) {
    moveItem(hero, this.roster, this.graveyard);
  }

  sortHeroes (compareFn: (a: Hero, b: Hero) => number) {
    transaction(() => {
      this.roster = this.roster.sort(compareFn);
      this.roster.forEach((hero, index) => {
        hero.rosterIndex = index;
      });
    });
  }

  getStoreItems () {
    return [
      generateItem(),
      generateItem(),
      generateItem()
    ];
  }

  unequipAllItems () {
    transaction(() => {
      this.roster.forEach((hero) => {
        while (hero.items.length) {
          this.items.push(hero.items.pop());
        }
      });
    });
  }

  gotoNextWeek () {
    this.week++;

    // Randomize estate event
    const eventIndex = Math.floor(100 * Math.random());
    const newEvent = new EstateEvent();
    newEvent.message = "Event " + eventIndex;
    this.estateEvent = newEvent;

    // Randomize quests each week
    this.quests = [this.newQuest(), this.newQuest(), this.newQuest()];
    this.selectedQuestId = this.quests[0].id;

    // Randomize coach each week
    this.coach = [this.newHero(), this.newHero()];
  }

  newHero () {
    return generateHero([...this.roster, ...this.coach]);
  }

  newQuest () {
    return generateQuest(this.dungeons);
  }
}

export enum Difficulty {
  Radiant = "Radiant",
  Darkest = "Darkest",
  Stygian = "Stygian"
}
