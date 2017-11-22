import {identifier, serializable} from "serializr";
import {IStatsSource, Stats} from "./Stats";
import {BuildingInfoId} from "./BuildingInfo";

export type QuirkId = string;

export class QuirkInfo implements IStatsSource {
  @serializable(identifier()) id: QuirkId;
  public name: string;
  public treatmentCostScale = 1.5;
  public stats: Stats;
  public forcedTreatmentIds: BuildingInfoId[] = [];
  public bannedTreatmentIds: BuildingInfoId[] = [];
  statsSourceName: string = "Quirk";
}
