import {identifier, serializable} from "serializr";
import {IStatsSource} from "./Stats";
import {Stats} from "./Stats";

export class CharacterClassInfo implements IStatsSource {
  @serializable(identifier()) id: string;
  name: string;
  avatarUrl: string = require("../../../assets/images/hero.png");
  stats: Stats;
  statsSourceName: string = "Class";
  hasBaseStats: boolean = true;
}
