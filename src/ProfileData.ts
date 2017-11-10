import {observable} from "mobx";

// Temporary structure/filename, may need to be renamed/moved elsewhere

export class EstateEvent {
  @observable public shown: boolean;

  constructor (
    public message: string,
    shown: boolean = false
  ) {
    this.shown = shown;
  }
}

export class Adventure {
  @observable status = AdventureStatus.Pending;
}

export enum AdventureStatus {
  Pending = "Pending",
  Defeat = "Defeat",
  Escape = "Escape",
  Victory = "Victory"
}
