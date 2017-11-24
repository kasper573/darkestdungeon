import {identifier, list, object, serializable} from "serializr";
import uuid = require("uuid");
import {QuestMap} from "./QuestMap";
import {QuestObjective} from "./QuestObjective";
import {Item} from "./Item";
import {computed, observable, when} from "mobx";
import {QuestInfo} from "./QuestInfo";
import {Battle} from "./Battle";
import {DungeonId} from "./Dungeon";
import {MapLocationId} from "./QuestRoom";
import {Character} from "./Character";

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

  @serializable @observable currentRoomId: MapLocationId;
  @computed get currentRoom () {
    return this.map.rooms.find((room) => room.id === this.currentRoomId);
  }

  @computed get explorePercentage () {
    const scoutedRooms = this.map.rooms.filter((room) => room.isScouted);
    return scoutedRooms.length / this.map.rooms.length;
  }

  @computed get monsterPercentage () {
    const monsters = this.map.rooms.reduce((reduction, room) => {
      reduction.push(...room.monsters);
      return reduction;
    }, [] as Character[]);

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

  whenVictorious (callback: () => void) {
    return when(() => this.isObjectiveMet, callback);
  }

  applyItem (item: Item) {
    this.light += item.info.offsetLight;
  }
}

export enum QuestStatus {
  Idle = "Idle",
  Started = "Started",
  Defeat = "Defeat",
  Escape = "Escape",
  Victory = "Victory"
}
