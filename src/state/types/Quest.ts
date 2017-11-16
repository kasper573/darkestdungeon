import {identifier, list, object, serializable} from "serializr";
import uuid = require("uuid");
import {QuestMap} from "./QuestMap";
import {QuestObjective} from "./QuestObjective";
import {Item} from "./Item";
import {observable} from "mobx";
import {QuestInfo} from "./QuestInfo";
import {Battle} from "./Battle";
import {DungeonId} from "./Dungeon";

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

export enum QuestStatus {
  Idle = "Idle",
  Started = "Started",
  Defeat = "Defeat",
  Escape = "Escape",
  Victory = "Victory"
}
