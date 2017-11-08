import {observable} from "mobx";
import {Point} from "./Bounds";

export class UIState {
  @observable centerPosition: Point = {x: 0, y: 0};
}
