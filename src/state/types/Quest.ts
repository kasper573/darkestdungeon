import {identifier, list, object, serializable} from "serializr";
import uuid = require("uuid");
import {QuestMap} from "./QuestMap";
import {QuestObjective} from "./QuestObjective";
import {Item} from "./Item";
import { computed, intercept, observable,  reaction, transaction, when} from "mobx";
import {QuestInfo} from "./QuestInfo";
import {Battle} from "./Battle";
import {DungeonId} from "./Dungeon";
import {MapLocationId} from "./QuestRoom";
import {Character} from "./Character";
import {removeItem, without} from "../../lib/Helpers";
import {Hero} from "./Hero";

export type QuestId = string;

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

  @serializable(object(Battle))
  @observable
  battle?: Battle;

  @serializable(list(object(Item)))
  @observable
  items: Item[] = [];

  @serializable @observable previousRoomId: MapLocationId;
  @serializable @observable currentRoomId: MapLocationId;

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
    let monsters = this.map.rooms.reduce((reduction, room) => {
      reduction.push(...room.monsters);
      return reduction;
    }, [] as Character[]);

    if (this.battle) {
      monsters = [...monsters, ...this.battle.monsters];
    }

    const deadMonsters = monsters.filter((monster) => monster.isDead);
    return deadMonsters.length / monsters.length;
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
  }

  canChangeToRoom (roomId: MapLocationId) {
    if (this.battle) {
      return false;
    }

    const requestedRoom = this.map.rooms.find((room) => room.id === roomId);
    return this.currentRoom.isConnectedTo(requestedRoom);
  }

  newBattle (monsters: Character []) {
    if (this.battle) {
      throw new Error("Cannot initiate a new battle while already in one");
    }

    // Move monsters from the current room to the battle
    // NOTE this is to avoid duplicates when serializing
    transaction(() => {
      this.currentRoom.monsters = without(this.currentRoom.monsters, monsters);
      this.battle = new Battle();
      this.battle.monsters = monsters;
    });
  }

  endBattle () {
    if (!this.battle) {
      return;
    }

    transaction(() => {
      // Return monsters to the room
      while (this.battle.monsters.length) {
        const monster = this.battle.monsters.pop();
        if (monster.isAlive) {
          monster.resetMutableStats();
        }
        this.currentRoom.monsters.push(monster);
      }

      this.battle = null;
    });
  }

  whenVictorious (callback: () => void) {
    return when(() => this.isObjectiveMet, callback);
  }

  useItem (item: Item, targetHero: Hero) {
    this.applyItem(item); // Apply quest stats
    targetHero.applyItem(item); // Apply hero stats
    removeItem(this.items, item); // Dispose item
  }

  applyItem (item: Item) {
    this.light += item.info.offsetLight;
  }

  retreatFromBattle () {
    this.changeRoom(this.previousRoomId);
  }

  /**
   * Initializes quest behavior
   */
  initialize () {
    return [
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
          if (room.monsters.length) {
            this.newBattle(room.monsters);
          }
        }
      )
    ];
  }
}

export enum QuestStatus {
  Idle = "Idle",
  Started = "Started",
  Defeat = "Defeat",
  Escape = "Escape",
  Victory = "Victory"
}
