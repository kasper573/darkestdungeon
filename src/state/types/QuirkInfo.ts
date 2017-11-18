import {identifier, serializable} from "serializr";
import {IStatsSource, Stats} from "./Stats";

export class QuirkInfo implements IStatsSource {
  @serializable(identifier()) id: string;
  public name: string;
  public stats: Stats;
  statsSourceName: string = "Quirk";
}
