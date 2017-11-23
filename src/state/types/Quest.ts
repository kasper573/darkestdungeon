import {identifier, list, object, serializable} from "serializr";
import uuid = require("uuid");
import {QuestMap} from "./QuestMap";
import {QuestObjective} from "./QuestObjective";
import {Item} from "./Item";
import {computed, observable} from "mobx";
import {QuestInfo} from "./QuestInfo";
import {Battle} from "./Battle";
import {DungeonId} from "./Dungeon";
import {MapLocationId} from "./QuestRoom";

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
