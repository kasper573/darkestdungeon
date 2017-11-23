import {date, identifier, list, object, reference, serializable} from "serializr";
import uuid = require("uuid");
import {computed, observable, transaction} from "mobx";
import {Path} from "./Path";
import {EstateEvent} from "./EstateEvent";
import {Hero} from "./Hero";
import {Quest, QuestId} from "./Quest";
import {Item} from "./Item";
import {Dungeon} from "./Dungeon";
import {generateHero, generateQuest} from "../Generators";
import {cap, count, moveItem, removeItem, removeItems} from "../../lib/Helpers";
import {StaticState} from "../StaticState";
import {BuildingUpgradeInfo} from "./BuildingUpgradeInfo";
import {HeirloomType, ItemType} from "./ItemInfo";
import {BuildingInfoId} from "./BuildingInfo";
import {Stats} from "./Stats";
import {HeroResidentInfo} from "./HeroResidentInfo";
import {Skill} from "./Skill";

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
  @observable debt: number = 0;

  @computed get goldAfterDebt () { return this.gold - this.debt; }

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

  @serializable(list(reference(BuildingUpgradeInfo, StaticState.lookup((i) => i.buildingUpgrades))))
  @observable
  buildingUpgrades: BuildingUpgradeInfo[] = [];

  get heirloomConversionRate () {
    return 1.5;
  }

  @computed get heirloomCounts () {
    return this.items
      .filter((item) => item.info.type === ItemType.Heirloom)
      .reduce((sum, item) => {
        sum.set(item.info.heirloomType, (sum.get(item.info.heirloomType) || 0) + 1);
        return sum;
      }, new Map<HeirloomType, number>());
  }

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

  @computed get isRosterFull () {
    return this.roster.length === this.rosterSize;
  }

  @computed get rosterSize () {
    return this.getUpgradeEffects("coach", "roster").size;
  }

  @computed get coachSize () {
    return this.getUpgradeEffects("coach", "network").size;
  }

  processResidencyEffects () {
    this.roster
      .filter((hero) => hero.residentInfo && hero.residentInfo.isLockedIn)
      .forEach((resident) => {
        const upgrades = this.getUpgradeEffects(resident.residentInfo.buildingId);

        // Recover a percentage of the residents stress
        const recoveryPercentage = cap(upgrades.recovery, 0, 1);
        const recoveryStats = new Stats();
        recoveryStats.stress.value -= recoveryPercentage * resident.stats.stress.value;
        resident.offsetStats(recoveryStats);

        // Remove treated quirk or disease
        if (resident.residentInfo.treatmentId) {
          removeItem(resident.quirks,
            resident.quirks.find((q) => q.id === resident.residentInfo.treatmentId)
          );
          removeItem(resident.diseases,
            resident.diseases.find((q) => q.id === resident.residentInfo.treatmentId)
          );
          resident.residentInfo = null;
        }
      });
  }

  clearNonLockedResidents () {
    this.roster
      .filter((hero) => hero.residentInfo && !hero.residentInfo.isLockedIn)
      .forEach((hero) => hero.residentInfo = null);
  }

  purchaseItem (item: Item) {
    this.gold -= item.info.value;
    this.items.push(item);
  }

  disposeItem (item: Item) {
    removeItem(this.items, item);
  }

  getResidencyCost (residency: HeroResidentInfo) {
    const cost = this.getUpgradeEffects(residency.buildingId).cost;
    const quirkToTreat = StaticState.instance.findQuirkOrDisease(residency.treatmentId);
    const costScale = quirkToTreat ? quirkToTreat.treatmentCostScale : 1;
    return cost * costScale;
  }

  purchaseResidency (resident: Hero) {
    resident.lockInResidency();
    this.gold -= this.getResidencyCost(resident.residentInfo);
  }

  findResident (buildingId: BuildingInfoId, slotIndex: number) {
    return this.roster.find((hero) =>
      hero.residentInfo &&
      hero.residentInfo.buildingId === buildingId &&
      hero.residentInfo.slotIndex === slotIndex
    );
  }

  purchaseItemLevelUp (item: Item) {
    item.level++;
    this.gold -= this.getUpgradeEffects("blacksmith").cost;
  }

  purchaseSkillLevelUp (skill: Skill) {
    skill.level++;
    this.gold -= this.getUpgradeEffects("guild").cost;
  }

  getUpgradeEffects (...keys: string[]) {
    return StaticState.instance.getUpgradeEffects(keys, this.buildingUpgrades);
  }

  ownsUpgrade (upgradeItem: BuildingUpgradeInfo) {
    return this.buildingUpgrades.indexOf(upgradeItem) !== -1;
  }

  purchaseUpgrade (upgradeItem: BuildingUpgradeInfo) {
    this.offsetHeirlooms(upgradeItem.cost, -1);
    this.buildingUpgrades.push(upgradeItem);
  }

  hasEnoughHeirlooms (requiredAmounts: Map<HeirloomType, number>) {
    for (const [type, requiredAmount] of requiredAmounts.entries()) {
      if (this.heirloomCounts.get(type) < requiredAmount) {
        return false;
      }
    }
    return true;
  }

  getConvertedHeirloomValue (amount: number, from: HeirloomType, to: HeirloomType) {
    const fromInfo = StaticState.instance.heirlooms.find((info) => info.heirloomType === from);
    const toInfo = StaticState.instance.heirlooms.find((info) => info.heirloomType === to);
    return Math.floor(
      (amount * (fromInfo.value / this.heirloomConversionRate)) / toInfo.value
    );
  }

  tradeHeirlooms (givenAmount: number, from: HeirloomType, to: HeirloomType) {
    const receivedAmount = this.getConvertedHeirloomValue(givenAmount, from, to);
    const deal = new Map<HeirloomType, number>();
    deal.set(from, -givenAmount);
    deal.set(to, receivedAmount);
    this.offsetHeirlooms(deal);
  }

  offsetHeirlooms (offset: Map<HeirloomType, number>, multiplier: number = 1) {
    offset.forEach((amount, type) => {
      amount *= multiplier;

      if (amount < 0) {
        // Remove heirlooms from inventory
        const removed = this.items
          .filter((item) => item.info.heirloomType === type)
          .slice(0, Math.abs(amount));
        removeItems(this.items, removed);
      } else if (amount > 0) {
        // Add new heirlooms to inventory
        const heirloomInfo = StaticState.instance.heirlooms
          .find((info) => info.heirloomType === type);
        const newHeirlooms = count(amount).map(() => Item.fromInfo(heirloomInfo));
        this.items.push(...newHeirlooms);
      }
    });
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

  recruitHero (hero: Hero) {
    moveItem(hero, this.coach, this.roster);
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
    return Array.from(StaticState.instance.items.values())
      .filter((info) => info.getStoreCount)
      .reduce((items, info) => {
        const num = info.getStoreCount(this.selectedQuest);
        const newItems = count(num).map(() => Item.fromInfo(info));
        return items.concat(newItems);
      }, []);
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
    this.coach = count(this.coachSize).map(() => this.newHero());

    this.processResidencyEffects();
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
