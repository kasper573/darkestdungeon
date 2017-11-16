export enum StatsModSource {
  Affliction = "Affliction",
  Item = "Item",
  Quirk = "Quirk"
}

export type StatsValue = number[] | number;

export type StatsMod = {
  units?: number,
  percentages?: number,
  source: StatsModSource
};

export class StatsInfo {
  constructor (
    public shortName: string,
    public longName: string,
    public value: StatsValue,
    public mods: StatsMod[] = [],
    public isPercentage: boolean = false
  ) {}
}
