import {identifier, list, object, serializable} from "serializr";
import uuid = require("uuid");
import {QuestMap} from "./QuestMap";
import {QuestObjective} from "./QuestObjective";
import {Item} from "./Item";
import {autorun, computed, intercept, observable, reaction, when} from "mobx";
import {QuestInfo} from "./QuestInfo";
import {DungeonId} from "./Dungeon";
import {MapLocationId} from "./QuestRoom";
import {Character} from "./Character";
import {contains, moveItem, removeItem, without} from "../../lib/Helpers";
import {Hero} from "./Hero";
import {Battler} from "./Battler";
import {Skill} from "./Skill";

export type QuestId = string;

export class Quest extends Battler<Hero> {
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

  @serializable(list(object(Hero)))
  @observable
  party: Hero[] = [];

  @serializable(list(object(Hero)))
  @observable
  deceased: Hero[] = [];

  // Data that changes throughout a quest
  @serializable @observable status: QuestStatus = QuestStatus.Idle;
  @serializable @observable light: number = 1;
  @serializable(list(object(Item))) @observable items: Item[] = [];
  @serializable @observable previousRoomId: MapLocationId = null;
  @serializable @observable currentRoomId: MapLocationId = null;

  @computed get previousRoom () {
    return this.map.rooms.find((room) => room.id === this.previousRoomId);
  }

  @computed get currentRoom () {
    return this.map.rooms.find((room) => room.id === this.currentRoomId);
  }

  @computed get explorePercentage () {
    const scoutedRooms = this.map.rooms.filter((room) => room.isScouted);
    return scoutedRooms.length / this.map.rooms.length;
  }

  @computed get monsterPercentage () {
    let allMonsters = this.map.rooms.reduce((reduction, room) => {
      reduction.push(...room.monsters);
      return reduction;
    }, [] as Character[]);

    if (this.inBattle) {
      allMonsters = [...allMonsters, ...this.enemies];
    }

    const deadMonsters = allMonsters.filter((monster) => monster.isDead);
    return deadMonsters.length / allMonsters.length;
  }

  @computed get isObjectiveMet () {
    return this.explorePercentage >= this.objective.explorePercentage &&
      this.monsterPercentage >= this.objective.monsterPercentage;
  }

  get info (): QuestInfo {
    if (this.objective.monsterPercentage) {
      return QuestInfo.hunt;
    } else if (this.objective.explorePercentage) {
      return QuestInfo.explore;
    }
    return QuestInfo.free;
  }

  changeRoom (roomId: MapLocationId) {
    this.previousRoomId = this.currentRoomId;
    this.currentRoomId = roomId;
    this.currentRoom.isScouted = true;
  }

  canChangeToRoom (roomId: MapLocationId) {
    if (this.inBattle) {
      return false;
    }

    const requestedRoom = this.map.rooms.find((room) => room.id === roomId);
    return this.currentRoom.isConnectedTo(requestedRoom);
  }

  retreatFromBattle () {
    this.changeRoom(this.previousRoomId);
  }

  newBattle (monsters: Character [] = []) {
    // Move monsters from the current room to the battle
    // NOTE this is to avoid duplicates when serializing
    this.currentRoom.monsters = without(this.currentRoom.monsters, monsters);
    super.newBattle(monsters);
  }

  endBattle (restoreEnemies = true) {
    // Return monsters to the room
    if (restoreEnemies) {
      for (const enemy of this.enemies) {
        this.currentRoom.monsters.push(enemy);
      }
    }
    super.endBattle();
  }

  useItem (item: Item, targetHero: Hero) {
    this.applyItem(item); // Apply quest stats
    targetHero.applyItem(item); // Apply hero stats
    removeItem(this.items, item); // Dispose item
  }

  applyItem (item: Item) {
    this.light += item.info.offsetLight;
  }

  whenVictorious (callback: () => void) {
    return when(() => this.isObjectiveMet, callback);
  }

  // TODO this should maybe be component state in DungeonOverview.tsx

  // No need to serialize since it's automated by quest behavior
  @observable selectedHero: Hero;
  @observable selectedEnemy: Character;
  @observable selectedSkill: Skill;

  selectHero (hero: Hero) {
    this.selectedHero = hero;
  }

  selectEnemy (enemy: Character) {
    this.selectedEnemy = enemy;
  }

  selectSkill (skill: Skill) {
    this.selectedSkill = skill;
  }

  /**
   * Initializes quest behavior
   */
  initialize () {
    return [
      ...super.initialize(() => this.party),

      // Leaving a room
      intercept(
        this,
        "currentRoomId",
        (change) => {
          this.endBattle();
          return change;
        }
      ),

      // Entering a new room
      reaction(
        () => this.currentRoom,
        (room) => {
          // Enter a new battle with monsters encountered in new rooms
          const aliveMonsters = room.monsters.filter((m) => m.isAlive);
          if (aliveMonsters.length) {
            this.newBattle(aliveMonsters);
          }
        },
        true
      ),

      // Clean up enemy selection should it disappear
      autorun(() => {
        if (this.selectedEnemy && !contains(this.enemies, this.selectedEnemy)) {
          this.selectedEnemy = null;
        }
      }),

      // Always keep a hero selected. Prioritize actor
      autorun(() => {
        if (this.turnActor instanceof Hero) {
          this.selectHero(this.turnActor);
        } else if (!this.selectedHero && this.party.length > 0) {
          this.selectHero(this.party[0]);
        }
      }),

      // Change skill selection when changing hero
      // Select/Deselect skills when entering/leaving battle
      autorun(() => {
        const hero = this.inBattle && this.selectedHero;
        this.selectSkill(hero ? hero.selectedSkills[0] : undefined);
      }),

      // Remove deceased heroes from the party
      autorun(() => {
        this.party
          .filter((m) => m.isDead)
          .forEach((m) => moveItem(m, this.party, this.deceased));
      })
    ];
  }

  whenPartyWipes (callback: () => void) {
    return when(() => this.party.filter((member) => member.isAlive).length === 0, callback);
  }
}

export enum QuestStatus {
  Idle = "Idle",
  Started = "Started",
  Defeat = "Defeat",
  Escape = "Escape",
  Victory = "Victory"
}
